const button = document.querySelector("#delete");
const deleteButton = () => {
  const productId = button.parentNode.querySelector("[name=productId]").value;
  const csrfToken = button.parentNode.querySelector("[name=_csrf]").value;
  const parentElement = button.closest("article");
  const url = "/admin/product/" + productId;
  fetch(url, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => {
      // console.log(result)
      return result.json();
    })
    .then((data) => {
      console.log(data);
      parentElement.remove();
    })
    .catch((err) => console.log(err));
};
button.addEventListener("click", deleteButton);
