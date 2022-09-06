// multi=true --> can pick multiple options
// write=true --> can write in input
// single mode is default

function createSelector(searchParam, ...params) {

  let selectorID = 0;
  // create & replace all select's with 'searchParam' - selector
  initializeSelector(searchParam, params);

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

      let wrapper = createCustomWrapper(optionsContent, label, selectorID, params);
      selectorID++;
      item.insertAdjacentElement('afterend', wrapper);
      item.remove();
      optionsContent = [];
    }
  }

  function createCustomWrapper(optionsArr, label, wrapperID, params) {
    let wrapper = document.createElement('div');
    let options = document.createElement('div');
    let placeholder;

    // validate placeholder --> write = true => placeholder = input
    //                         write = false => placeholder = div
    if (params[1].includes("write") && params[1].includes("true")) {
      placeholder = document.createElement("input");
      placeholder.classList.add("input");

      // placeholder.addEventListener("focus", showOptions);
      placeholder.addEventListener("click", showOptions);
      // placeholder.addEventListener("click", test);
      placeholder.addEventListener("input", checkOptions);
    } else {
      placeholder = document.createElement("div");

      placeholder.addEventListener("click", showOptions);
    }

    wrapper.classList.add("custom__select__wrapper");
    wrapper.id = "customSelector" + wrapperID;
    placeholder.classList.add("custom__select__placeholder");
    options.classList.add("custom__select__options");

    wrapper.insertAdjacentElement("afterbegin", placeholder);
    placeholder.insertAdjacentElement("afterend", options);

    for (let i = 0; i < optionsArr.length; i++) {
      let option = document.createElement("div");

      option.classList.add("custom__select__option");
      option.dataset.selected = false;
      option.textContent = optionsArr[i];

      if (typeof params[0] === "string" && params[0].includes("multi")) {
        if (params[0].includes("true")) option.addEventListener("click", chooseMultiOptions);
        if (params[0].includes("false")) option.addEventListener("click", chooseOption);
      } else {
        option.addEventListener("click", chooseOption);
      }

      options.insertAdjacentElement('beforeend', option);
    }

    // validate label
    if (label) {
      placeholder.textContent = label;
    } else if (params[0].includes("multi")) {
      if (params[0].includes("true")) placeholder.textContent = "Choose options...";
      if (params[0].includes("false")) placeholder.textContent = "Choose option...";
    } else {
      placeholder.textContent = "Choose option...";
    }

    if (params[1].includes("write") && params[1].includes("true")) placeholder.placeholder = "Find option...";
    
    return wrapper;
  }

  // multi == false (single mode)
  function chooseOption(event) {
    let wrapper = event.currentTarget.parentElement.parentElement;
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

    // check for previous selected option
    let options = wrapper.querySelectorAll(".custom__select__option");
    for (let item of options) {
      if (item.dataset.selected == "true") {
        item.dataset.selected = false;
      }
    }

    // let newElem = document.createElement('div');
    let input = wrapper.querySelector(".custom__select__placeholder");
    if (input.classList.contains("input")) {
      event.currentTarget.dataset.selected = true;
      input.placeholder = event.currentTarget.textContent;
      input.classList.remove("active");

      wrapper.querySelector(".custom__select__options").classList.remove("active");
      wrapper.querySelector(".custom__select__options").style.display = "none";
    } else {
      let newElem = document.createElement('div');
      newElem.classList.add("custom__select__placeholder");
      newElem.textContent = event.currentTarget.textContent;
      event.currentTarget.dataset.selected = true;

      wrapper.querySelector(".custom__select__placeholder").remove();
      wrapper.insertAdjacentElement('afterbegin', newElem);
      wrapper.querySelector(".custom__select__options").classList.remove("active");
      wrapper.querySelector(".custom__select__options").style.display = "none";

      newElem.addEventListener('click', showOptions);
    }
  }

  // multi == true (multiple mode)
  function chooseMultiOptions(event) {
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

    if (event.currentTarget.dataset.selected === "true") {
      event.currentTarget.dataset.selected = false;
      event.currentTarget.classList.remove("multi__selected");
    } else {
      event.currentTarget.dataset.selected = true;
      event.currentTarget.classList.add("multi__selected");
    }

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
      inputUnfocus(event);
      // console.log(event.composedPath());
    } else {
      event.currentTarget.classList.add("active");
      wrapper.querySelector(".custom__select__options").style.display = "block";
    }

    // переделать !
    inputBlur(event, wrapper);
  }

  function inputBlur(event, wrapper) {
    let executeCounter = 0;
    let currInput;

    for (let item of event.composedPath()) {
      if (item.classList && item.classList.contains("input") && item.classList.contains("active")) {
        currInput = item;
        document.addEventListener("click", blur);
      }
    }

      function blur(event) {
        executeCounter++;
        // console.log("click doc");
        if (executeCounter > 1) {
          for (let item of event.composedPath()) {
            if ( (item.classList && item.classList.contains("custom__select__placeholder")) || 
                  (item.classList && item.classList.contains("custom__select__options")) ||
                  (item.classList && item.classList.contains("custom__select__option"))) {
              return;
            } else if (currInput.classList.contains("active")){
              // currInput.classList.remove("active");
              currInput.classList.remove("active");
              currInput.nextElementSibling.style.display = "none";
            }
          }
          console.log("removed");
          document.removeEventListener("click", blur);
        }
      }
      // let executeCounter = 0;
      // let input = event.currentTarget;
      // document.body.addEventListener("click", blur);

      // function blur(event) {
      //   executeCounter++;
      //   if (executeCounter > 1) {
      //     if (!event.target.classList.contains("custom__select__option")) {
      //       input.classList.remove("active");
      //       wrapper.querySelector(".custom__select__options").style.display = "none";
      //       document.body.removeEventListener("click", blur);
      //     }
      //   }
      // }

    // }
  }

  function inputUnfocus(event) {
    if (event.currentTarget.classList.contains("input")) event.currentTarget.blur();
  }

  // write == true
  function checkOptions(event) {
    console.log("printing");
  }
}



