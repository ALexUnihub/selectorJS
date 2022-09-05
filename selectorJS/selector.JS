function createSelector() {
  let wrapper = document.querySelector(".custom__select__wrapper");
  let optionWrapper = wrapper.querySelector(".custom__select__placeholder");
  let options = wrapper.querySelectorAll('.custom__select__option');

  optionWrapper.addEventListener("click", showOptions);
  for (let item of options) {
    item.addEventListener("click", chooseOption);
  }

  function showOptions(event) {
    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      wrapper.querySelector(".custom__select__options").style.display = "none";
    } else {
      event.currentTarget.classList.add("active");
      wrapper.querySelector(".custom__select__options").style.display = "block";
    }
  }

  function chooseOption(event) { 
    let newElem = document.createElement('div');
    newElem.classList.add('custom__select__placeholder');
    newElem.textContent = event.currentTarget.textContent;

    wrapper.querySelector('.custom__select__placeholder').remove();
    wrapper.insertAdjacentElement('afterbegin', newElem);
    wrapper.querySelector('.custom__select__options').classList.remove("active");
    wrapper.querySelector(".custom__select__options").style.display = "none";

    newElem.addEventListener('click', showOptions);
  }
}

