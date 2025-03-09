document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".details-btn");

    buttons.forEach((button) => {
        button.addEventListener("mouseover", function () {
            this.style.backgroundColor = "#007bff";
            this.style.transition = "0.3s ease-in-out";
        });

        button.addEventListener("mouseout", function () {
            this.style.backgroundColor = "black";
        });
    });
});
   