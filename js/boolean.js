const divEl = document.createElement(`div`);

divEl.innerHTML = `
  <p style="color: white; position: fixed; bottom: 10px; left: 10px;animation: shake 0.5s ;">
    Made with 💚 by Boolean.
    <a style="color: white; " href="https://boolean.co.uk/apply" target="_blank">Apply today!</a>
  </p>
`;

document.body.append(divEl);
