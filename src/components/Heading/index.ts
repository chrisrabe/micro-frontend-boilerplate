import ReactMicroUI from '../../micro-ui/ReactMicroUI';
import { lazy } from 'react';

export default new ReactMicroUI({
  component: lazy(() => import('./Heading')),
  componentId: 'microfe.Heading'
});

