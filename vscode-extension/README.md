# Borescope for Python

Borescope let's you inspect variables visually when debugging Python code with VSCode.

## Concept

There are some VSCode extensions already that can let you view an image during Python debugging.

How is borescope different?

* Borescope is meant for many data types and interactive visualization
  * View multi-channel images, change brightness, colormaps etc.
  * Fly through 3D point clouds
  * Plot graphs of time series
* Other extensions don't work with remote debugging, because they write temporary files to disk
  * Borescope tranfers the variable's value through the Debugger API and hence works remotely
* Borescope comes with a dedicated GUI application for visualization
  * This means you can view variables and interact with them in a separate window which you can have side-by-side on a different screen
