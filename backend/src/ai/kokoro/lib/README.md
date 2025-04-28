# Kokoro TTS Implementation

## Overview
This directory contains a TypeScript implementation of the Kokoro text-to-speech system, adapted from the official [Kokoro.js repository](https://github.com/hexgrad/kokoro/tree/main/kokoro.js). The code has been copied and modified to address specific issues encountered with the original package.

## Why I Copied the Code
The decision to copy and adapt the code from the official repository was made due to a critical issue with the original `kokoro-js` npm package (version 1.2.0). When using the package directly, I encountered problems with the Hugging Face dependency, which would download corrupted ONNX model files. This corruption prevented the TTS system from functioning correctly in my application.

By copying and adapting the source code, I was able to:
1. Fix the model loading issues
2. Maintain full control over the implementation
3. Customize the code to better fit my application's needs
4. Avoid dependency issues that could break my production system

## Modifications Made
The following modifications were made to the original code:

1. **TypeScript Conversion**: The entire codebase has been translated from JavaScript to TypeScript, providing better type safety and developer experience.

2. **Explicit Type Definitions**: I've added explicit type definitions throughout the code to improve maintainability and catch potential errors at compile time.

3. **Voice Optimization**: I've removed all voices except for `af_heart`, which is the only voice required for my application. This reduces the package size and simplifies the implementation.

4. **Integration with NestJS**: The code has been adapted to work seamlessly within my NestJS backend architecture.

## Attribution
The original code is from the [Kokoro.js project](https://github.com/hexgrad/kokoro/tree/main/kokoro.js) and is available on npm as [kokoro-js](https://www.npmjs.com/package/kokoro-js/v/1.2.0). I acknowledge and thank the original authors for their work.

## Maintenance
When updating this code, please consider checking the original repository for any important updates or bug fixes that might need to be incorporated into my implementation.