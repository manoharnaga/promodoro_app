import React from 'react';

function Test() {
  const startExperiment = () => {
    // Create a new window or tab for the experiment
    const experimentWindow = window.open('', '_blank'); // Opens a new tab

    // Wait until the new tab has fully loaded
    experimentWindow.document.write('<html><head><title>Experiment</title></head><body><div id="experiment"></div></body></html>');

    // Load PsychoJS and the experiment
    experimentWindow.document.body.onload = () => {
      // Example PsychoJS experiment setup (ensure you have your .psyexp file)
      const psychoJS = new window.PsychoJS({
        debug: true
      });

      // Your experiment file path (make sure this file is in your public folder)
      const experimentFile = 'lib/experiment.psyexp';  // Path to your .psyexp file

      // Load the experiment and run it
      psychoJS.start({
        expName: 'ColourTesting',
        expInfo: { participant: '', session: '001' }
      });

      // Assuming your .psyexp file exports a function to start the experiment
      fetch(experimentFile)
        .then((response) => response.text())
        .then((psyexpData) => {
          psychoJS.experiment = new window.PsychoJS.Experiment(experimentWindow, psychoJS);
          psychoJS.experiment.load(psyexpData).then(() => {
            psychoJS.experiment.start();
          });
        })
        .catch((error) => {
          console.error('Failed to load the .psyexp file:', error);
        });
    };
  };

  return (
    <div>
      <h1>Run Experiment</h1>
      <button onClick={startExperiment}>Start Experiment</button>
    </div>
  );
}

export default Test;
