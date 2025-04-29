/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import NProgress from 'nprogress';
import './progress.css';

export default function asyncComponent(DisplayComponent) {
  const AsyncComponent = (props) => {
    const [loadedComponent, setLoadedComponent] = useState(null);
    const [mount, setMount] = useState(false);
    NProgress.configure({ showSpinner: false });
    useEffect(() => {
      setMount(true);

      const loadComponent = async () => {
        // Display progress indicator
        NProgress.start();

        // // Wait for the component to be loaded
        await new Promise((resolve) => setTimeout(resolve, 1));

        // Set the loaded component as the state
        setLoadedComponent(<DisplayComponent {...props} />);

        // Hide progress indicator
        NProgress.done();
      };

      loadComponent();

      return () => {
        setMount(false);
      };
    }, []);

    return (
      <div className="globalHeight">
        {mount ? loadedComponent : <div />}
      </div>
    );
  };
  return AsyncComponent;
}
