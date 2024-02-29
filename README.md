# Micro Frontend Starter Kit

## Overview
This is a boilerplate for creating embeddable micro frontend components. It aims to
provide a simplified implementation for those that doesn't want to be tied to a specific 
micro frontend library's ecosystem.

It uses `webpack` to bundle the scripts, and `AWS CDK` to deploy and serve the bundle. It also provides code for
how you may use the `MicroUI` interface in React and Plain JS. Any of these components inside the boilerplate can
be modified, changed or optimised depending on your business requirements.

## Getting Started

```shell
npm install
npm run dev # start dev server
```

## Purpose

Libraries like `single-spa` or `webpack 5 federation` are commonly used for creating
micro frontends because they both address the issue of increased bundle size. The downside of using tools like these is that
it ties you to approach frontend development in a specific way. It does not allow teams to experiment and optimise with
their tooling in the future. With this boilerplate, I aim to strip down the concept of microfronts to its core concepts
and provides a pattern that allows teams to innovate and experiment in the future.

## Concept

Micro frontends are essentially javascript bundles that contain information about what to render on the screen and
instructions for how to render itself. I provided a `MicroUI` interface that allows teams to define how components are
mounted or unmounted on their browser. These instructions can be defined using any framework of choice.

In this repo, I divided the micro frontend concept into four lifecycle stages.

1. Embed - Load the micro FE bundle
2. Initialise - Inject the micro FE bundle script into the window space
3. Mount - Inject micro FE into wrapper elements
4. Unmount - Remove micro FE from wrapper elements

Each of these stages can optimised and changed depending on how your organisation or teams works.

1. **Embed** focuses on `infrastructure` and `bundling` approaches. You can optimise it by changing how the micro frontends are bundled and lazy loaded into the screen. You can also update how the bundle is served on the browser.
2. **Initialise** focuses on `memory usage` and `namespacing`. Putting a bunch of code inside the `window` space will surely consume a lot of memory. You can optimise this by changing how and when the script is embedded into the window space.
3. **Mount** and **Unmount** focuses on the `frontend framework` of choice.


### Usage

### Code Structure

Inside the `src` folder, you'll find two subdirectories `components` and `micro-ui`.

- `components` folder contain all of your component definition
- `micro-ui` folder contains instructions for rendering and embedding your component into a page

### Using your framework of choice

At the moment, the boilerplate provides two examples for rendering components; React and plain JS. Both of them
extend the `MicroUI` abstract class and defines instructions for mounting and unmounting your component. 

The `MicroUI` abstract class contain instructions for mounting the component into the window space and these instructions rarely change. 
The classes that extends the `MicroUI` class is meant to represent the framework you'll be using to inject or remove your component into
your browser's DOM.

If you want to use another framework, simply create another file inside the `micro-ui` folder with a class definition that extends the `MicroUI`
abstract class.

### Making a component a "Micro Frontend"

To create a component, you simply create folder and a file with your component name and build it in the way that components are normally defined in your
framework of choice. After that, create an `index.ts` file inside your component's folder and wrap it around your MicroUI class.
**Your component is only a component for your framework until you've wrapped it around your MicroUI concrete class**. 

For example, the React component for `Heading` can be treated as a normal React component in tests. The only time that
it becomes a "Micro Frontend" is when we wrapped it around the MicroUI class inside the `index.ts` file.

```shell
import ReactMicroUI from '../../micro-ui/ReactMicroUI';
import { lazy } from 'react';

export default new ReactMicroUI({
  component: lazy(() => import('./Heading')),
  componentId: 'microfe.Heading'
});
```

This means that we can use the `Heading` component definition in tools like Storybook interaction to test the behaviour 
of the component.

Also, wrapping the component with the `MicroUI` class will make sure that your component is injected into the `window` space
using the `componentId` property. This will allow you to use `window["componentId"].mount(...)` or `window["componentId"].unmount(...)` 
when embedding your component into your parent container.

### Injecting your MicroFrontend into the window space

After defining your component, you need to make sure that it's available on the browser. Inside the `src` folder, there's
an `index.ts` file that exports the components you wish to expose into the FE. You must export your component into this file
so that it's accessing through the window space. This can be optimised further by adding lazy loading on the components that's
imported in the `index.ts` file.

Components can only be rendered on the screen once the document is ready. Make sure to call the `mount` function when the document's
ready state is complete.

```shell
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);

      // Retrieve HTML Elements
      const heading = document.getElementById("heading");
      const textArea = document.getElementById("textarea");

      // Mount components
      window['microfe.Heading'].mount({
        elem: heading,
        props: {
          value: 'Micro Frontend Starter'
        }
      });

      window['microfe.TextBox'].mount({
        elem: textArea,
      });
    }
  })
```

Alternatively, you can also listen to the `MicroFrontendLoaded` event that's emitted once the bundle is successfully embedded into
the window space.

```shell
const componentMap = {
  'microfe.Heading': 'heading'
}

document.addEventListener('MicroFrontendLoaded', (e) => {
  console.log(e.detail);
  if(componentMap[e.detail]) {
    const elemId = componentMap[e.detail];
    const elem = document.getElementById(elemId);
    if (elem) {
      window[e.detail].mount({
        elem,
        props: {
          value: 'Micro Frontend Starter'
        }
      })
    }
  }
})
```

### Deployment

This boilerplate uses AWS CDK to create the infrastructure for serving your micro frontend application. If you wish to use this
[please make sure that CDK is set up in your AWS account](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html). 


To use it, simply do the following:

1. Make sure to modify the `appName` variable inside the `infra` folder.

2. Run the following commands:
    ```shell
    npm run build
    npm run cdk:synth
    npm run cdk:deploy
    ```
