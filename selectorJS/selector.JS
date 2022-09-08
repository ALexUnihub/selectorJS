// multi=true --> can pick multiple options
// write=true --> can write in input
// single mode is default

function createSelector(searchParam, paramsObj) {

  let selectorID = 0;
  let isOptionClicked = false;

  // create & replace all select's with 'searchParam' - selector
  initializeSelector(searchParam, paramsObj);

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

      let wrapper = createCustomWrapper(optionsContent, label, selectorID, paramsObj);
      selectorID++;
      item.insertAdjacentElement('afterend', wrapper);
      item.remove();
      optionsContent = [];
    }
  }

  function createCustomWrapper(optionsArr, label, wrapperID, paramsObj) {
    let wrapper = document.createElement('div');
    let options = document.createElement('div');
    let placeholder;

    // validate placeholder --> write = true => placeholder = input
    //                         write = false => placeholder = div
    if (paramsObj["write"]) {
      placeholder = document.createElement("input");
      placeholder.classList.add("input");

      let wrapperSearchOption = searchOptionWrapper(paramsObj["multi"]);

      placeholder.addEventListener("click", showOptionsInput);
      placeholder.addEventListener("input", wrapperSearchOption);
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

      if ("multi" in paramsObj) {
        if (paramsObj["multi"] == true) option.addEventListener("click", chooseMultiOptions);
        if (paramsObj["multi"] == false) option.addEventListener("click", chooseOption);
      } else {
        option.addEventListener("click", chooseOption);
      }

      options.insertAdjacentElement('beforeend', option);
    }

    // validate label
    if (label) {
      placeholder.textContent = label;
    } else if ("multi" in paramsObj) {
      if (paramsObj["multi"] == true) placeholder.textContent = "Choose options...";
      if (paramsObj["multi"] == false) placeholder.textContent = "Choose option...";
    } else {
      placeholder.textContent = "Choose option...";
    }

    if (paramsObj["write"] == true) placeholder.placeholder = "Find option...";
    
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

      if (item.classList.contains("single__selected")) {
        item.classList.remove("single__selected");
      }

    }

    let input = wrapper.querySelector(".custom__select__placeholder");

    if (input.classList.contains("input")) {

      event.currentTarget.dataset.selected = true;
      event.currentTarget.classList.add("single__selected");

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
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

    let wrapper = event.currentTarget.parentElement;

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      wrapper.querySelector(".custom__select__options").style.display = "none";
    } else {
      event.currentTarget.classList.add("active");
      wrapper.querySelector(".custom__select__options").style.display = "block";
    }
  }

  // write == true
  function showOptionsInput(event) {
    if (!event.currentTarget.parentElement) {
      console.log(`selector js, wrong parentElement in showOptions, 
                  expected custom__select__wrapper, 
                  got ${event.currentTarget.parentElement}`);
    }

    let wrapper = event.currentTarget.parentElement;

    if (!event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.add("active");
      wrapper.querySelector(".custom__select__options").style.display = "block";
    }

    inputCloseOptionsBar(event);
  }

  function inputCloseOptionsBar(event) {
    let executeCounter = 0;
    let currInput;
    let currID = 0;

    for (let item of event.composedPath()) {
      if (item.classList && item.classList.contains("input") && item.classList.contains("active")) {
        currInput = item;
        currID = item.parentElement.id;

        document.addEventListener("click", blur);
      }
    }

      function blur(event) {
        executeCounter++;
        if (executeCounter > 1) {
          for (let item of event.composedPath()) {
            if ( checkItemClassList(item, currID)) {
              return;
            } else if (currInput.classList.contains("active")){
              currInput.classList.remove("active");
              currInput.nextElementSibling.style.display = "none";
            }
          }
          document.removeEventListener("click", blur);
        }
      }
  }

  function checkItemClassList(item, wrapperID) {
    let isInput = item.classList && item.classList.contains("custom__select__placeholder") && item.classList.contains("input");
    let isOptions = item.classList && item.classList.contains("custom__select__placeholder") && item.classList.contains("input");
    let isOption = item.classList && item.classList.contains("custom__select__option");

    if (isInput && item.parentElement && item.parentElement.id) {
      isInput = (item.parentElement.id === wrapperID);
      return isInput;
    }

    return isInput || isOptions || isOption;
  }

  function searchOptionWrapper(isMulti) {
    let optionsArr = [];
    let prevStr = "";
    let prevStrLength = 0;
    let selectedElemText = null;

    return function (event) {
      let wrapper = null;
  
      if (!event.currentTarget.parentElement) return;

      wrapper = event.currentTarget.parentElement;

      let currOptionsArr = Array.from(wrapper.querySelectorAll(".custom__select__option"));
      let currStr = event.currentTarget.value;
    
      if (optionsArr.length === 0) {
        optionsArr = currOptionsArr.map(item => item);
      }

      for (let item of currOptionsArr) {
        if (item.dataset.selected === "true") selectedElemText = item.textContent;
      }

      redrawElems(wrapper.querySelector(".custom__select__options"), optionsArr, isMulti, selectedElemText, currStr);

      prevStr = currStr;
      prevStrLength = currStr.length;
    };
  }

  function redrawElems(wrapper, objArr, isMulti, selectedElemText, currStr) {
    let wrapperCollection = wrapper.querySelectorAll(".custom__select__option");

    for (let item of wrapperCollection) item.remove();

    for (let item of objArr) {

      if (!isMulti && item.textContent !== selectedElemText) {
        if (item.classList.contains("single__selected")) item.classList.remove("single__selected");
        item.dataset.selected = false;
      }

      if (item.textContent.includes(currStr)) wrapper.insertAdjacentElement("beforeend", item);
    }

    wrapperCollection = wrapper.querySelectorAll(".custom__select__option");

    if (Array.from(wrapperCollection).length === 0) {

      let noMatchesElem = createNoMatchesElem();
      wrapper.insertAdjacentElement("beforeend", noMatchesElem);

      return;
    }
  }

  function createNoMatchesElem() {
    let elem = document.createElement("div");

    elem.classList.add("custom__select__option");
    elem.classList.add("no__matches");
    elem.textContent = "No matches found..."
    
    return elem;
  }
}



