[
  ".row.mx-0.align-items-center.text-truncate.bg-lighter.text-capitalize.font-weight-bold",
  ".row.mx-0.mb-2.align-items-center",
  ".mt-2.text-accent.font-sm",
].forEach((el) => {
  const divToRemove = document.querySelector(el);
  divToRemove.remove();
});
