function createSelector(searchParam) {
  let selectorID = 0;
  // create & replace all select's with 'searchParam' - selector
  initializeSelector(searchParam);

  function initializeSelector(searchParam) {
    let optionsToReplace = document.querySelectorAll(searchParam);
    let optionsCounter = 0;
    let optionsContent = [];
    let label = null;

    for (let item of optionsToReplace) {
      optionsCounter = 0;
      for (let subItem of item.childNodes) {
        if (subItem == '[object HTMLOptionElement]') {
          optionsCounter++;
          optionsContent.push(subItem.textContent);
        }
      }
    
      if (item.previousElementSibling == "[object HTMLLabelElement]") {
        label = item.previousElementSibling.textContent;
        item.previousElementSibling.remove();
      } else {
        label = null;
      }

      let wrapper = createCustomOption(optionsContent, label, selectorID);
      selectorID++;
      item.insertAdjacentElement('afterend', wrapper);
      item.remove();
    }
  }

  function createCustomOption(optionsArr, label, wrapperID) {
    let wrapper = document.createElement('div');
    let placeholder = document.createElement('div');
    let options = document.createElement('div');

    wrapper.classList.add("custom__select__wrapper");
    wrapper.id = "customSelector" + wrapperID;
    placeholder.classList.add("custom__select__placeholder");
    options.classList.add("custom__select__options");

    wrapper.insertAdjacentElement('afterbegin', placeholder);
    placeholder.insertAdjacentElement('afterend', options);

    placeholder.addEventListener('click', showOptions);

    for (let i = 0; i < optionsArr.length; i++) {
      let option = document.createElement('div');

      option.classList.add("custom__select__option");

      option.textContent = optionsArr[i];
      option.addEventListener("click", chooseOption);
      options.insertAdjacentElement('beforeend', option);
    }

    if (label) {
      placeholder.textContent = label;
    } else {
      placeholder.textContent = "Placeholder";
    }
    
    return wrapper;
  }

  function showOptions(event) {
    let wrapper = event.currentTarget.parentElement;
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      wrapper.querySelector(".custom__select__options").style.display = "none";
    } else {
      event.currentTarget.classList.add("active");
      wrapper.querySelector(".custom__select__options").style.display = "block";
    }
  }

  function chooseOption(event) {
    let wrapper = event.currentTarget.parentElement.parentElement;
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

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

