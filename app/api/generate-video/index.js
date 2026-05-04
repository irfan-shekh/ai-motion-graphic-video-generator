const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { bundle } = require('@remotion/bundler');
const { getCompositions, renderMedia } = require('@remotion/renderer');

const app = express();
const port = 8080;

// This allows the server to accept JSON in request bodies.
app.use(cors());
app.use(express.json());

// --- Configuration ---
// Update these two variables to match your Remotion project setup.
const compositionId = 'MyMotionGraphic'; // The ID of the composition you want to render.
const entryPoint = 'src/index'; // The entry point to your Remotion project.

/**
 * This endpoint receives a POST request to render a video.
 * The request body should contain the `inputProps` for your Remotion composition.
 * These props would typically come from your AI generation logic.
 *
 * Example Request Body:
 * {
 *   "inputProps": {
 *     "text": "Hello World",
 *     "color": "blue"
 *   }
 * }
 */
app.post('/render', async (req, res) => {
    try {
        const { inputProps } = req.body;

        if (!inputProps) {
            return res.status(400).send('inputProps are required in the request body.');
        }

        console.log('Bundling the Remotion project...');
        // Bundle your Remotion project into a format that the renderer can understand.
        const bundleLocation = await bundle({
            entryPoint: path.resolve(entryPoint),
            webpackOverride: (config) => config,
        });

        console.log('Finding compositions...');
        // Get a list of all compositions in your project.
        const comps = await getCompositions(bundleLocation, {
            inputProps,
        });

        // Find the specific composition we want to render.
        const composition = comps.find((c) => c.id === compositionId);
        if (!composition) {
            return res.status(404).json({ message: `Composition '${compositionId}' not found.` });
        }

        // Define where the output video file will be saved.
        const outputDir = path.resolve(process.cwd(), 'public/videos');
        const outputFileName = `video-${Date.now()}.mp4`;
        const outputLocation = path.join(outputDir, outputFileName);

        // Ensure the output directory exists.
        fs.mkdirSync(outputDir, { recursive: true });

        console.log(`Rendering video to: ${outputLocation}`);

        // Trigger the render.
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation,
            inputProps,
        });

        console.log('Render finished!');

        // Respond with the URL to the newly created video.
        res.json({
            videoUrl: `/videos/${outputFileName}`,
        });
    } catch (err) {
        console.error('Error rendering video:', err);
        res.status(500).json({ message: 'An error occurred during video rendering.' });
    }
});

// Statically serve the 'public' directory, making videos accessible for download.
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Video generation server listening at http://localhost:${port}`);
    console.log(`- POST to /render to start a new video render.`);
    console.log(`- Generated videos will be available in the /public/videos directory.`);
});