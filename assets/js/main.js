setTimeout(() => {
  document.body.removeAttribute("data-transitions");
}, 100);

const codeBlocks = document.querySelectorAll(".language-php, .language-js, .language-css");
codeBlocks.forEach((codeBlock) => {
  const code = codeBlock.querySelector("code").innerText;

  const copiedAlert = document.createElement("div");
  copiedAlert.classList.add("code-copied-alert");
  copiedAlert.innerHTML = "<h3>Code copied to clipboard!</h3>";
  codeBlock.append(copiedAlert);

  const copyButton = document.createElement("button");
  copyButton.classList.add("fs--xs");
  copyButton.innerText = "Copy";
  copyButton.addEventListener("click", (ev) => {
    navigator.clipboard.writeText(code);
    codeBlock.dataset.copied = "true";

    setTimeout(() => {
      codeBlock.dataset.copied = null;
    }, 2000);
  });

  codeBlock.append(copyButton);
});
