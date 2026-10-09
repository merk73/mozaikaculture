# Cultural light

Desktop-only decorative hero light. The four-octave, golden-angle accumulation is adapted from [FractalNoise](https://github.com/shader-effects-inc/shaders/tree/d49008cc2d6b547f216ca09bc13ae8f44572f040/packages/core/src/shaders/FractalNoise) and `gpu/kit/noisePaints.ts`, commit `d49008cc2d6b547f216ca09bc13ae8f44572f040` (MIT).

This is a small WebGL adaptation, not the complete upstream WebGPU engine. It uses value noise, a red transparent ramp, a horizontal light mask and softly smoothed cursor displacement. Four octaves, at most 960 × 600 pixels and approximately 30 rendered frames per second. The renderer pauses offscreen and in hidden tabs; it releases GPU resources on disposal. Mobile, coarse pointers, reduced motion and data saver never import the renderer.
