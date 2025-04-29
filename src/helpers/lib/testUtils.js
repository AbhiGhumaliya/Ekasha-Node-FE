/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/forbid-foreign-prop-types */
import checkProptypes from 'check-prop-types';
import { TestCasePermissionData } from '../envData';

export const findByTestAtrr = (component, attr) => component.find(`[data-test='${attr}']`);
export const findByTestControlsAtrr = (component, attr) => component.find(`[aria-controls='${attr}']`);
export const findByNormal = (component, attr) => component.find(attr);
export const findByTestAtrrFirst = (component, attr) => component.find(`[data-test='${attr}']`).first();
export const checkProps = (component, expectedProps) => checkProptypes(component.propTypes, expectedProps, 'props', component.name);

export const handlePermission = (modulePermission, root, subRoot) => {
  const rootModule = JSON.parse(TestCasePermissionData.aclData);
  const rootIndex = rootModule.findIndex((d) => d.module === root);
  if (rootIndex !== -1) {
    if (subRoot !== undefined) {
      const subRootIndex = rootModule[rootIndex].subModules.findIndex((x) => x.module === subRoot);
      if (subRootIndex !== -1) {
        rootModule[rootIndex].subModules[subRootIndex].permission = modulePermission;
      }
    } else {
      rootModule[rootIndex].permission = modulePermission;
    }
  }
  return { aclData: JSON.stringify(rootModule) };
};

export const globalMatchMedia = () => {
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
};
