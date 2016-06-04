/*jslint
    node: true,
    browser: true,
    unparam: true
*/
/*globals
    globals,
    dealernet,
    document
*/
'use strict';
function $(id) {
    return document.getElementById(id);
}
function $c(valueClass) {
    return document.getElementsByClassName(valueClass);
}
function firstTag(tagName) {
    return document.getElementsByTagName(tagName)[0];
}
function clearElement(element) {
    var newElement = element.cloneNode(false);
    element.parentNode.insertBefore(newElement, element);
    element.parentNode.removeChild(element);
    return newElement;
}
function generateTextElement(tag, text) {
    var element = document.createElement(tag),
        lineText = document.createTextNode(text);
    element.appendChild(lineText);
    return element;
}
function generatebutton(fn, id, value) {
    var button = document.createElement("div");
    button.id = id;
    button.addEventListener("click", fn, false);
    button.appendChild(generateTextElement("h1", value));
    return button;
}
function buildOption(message) {
    var option = document.createElement("Option"),
        text = document.createTextNode(message);
    option.value = message;
    option.appendChild(text);
    return option;
}
function generateInput(type, carAttribute, identify) {
    var input = document.createElement("input");
    input.type = type;
    input.name = carAttribute;
    input.setAttribute("class", identify);
    return input;
}
function generateTable(attributes) {
    var tabla = document.createElement("table"),
        row = tabla.insertRow();
    tabla.id = "vehiculos";
    attributes.forEach(function (x) {
        row.insertCell().appendChild(document.createTextNode(x));
    });
    row.insertCell().appendChild(document.createTextNode("Vender"));
    return tabla;
}
function removeFirstWhite() {
    var white = this.firstChild;
    this.removeChild(white);
    this.removeEventListener("change", removeFirstWhite, false);
}
function buildSelect(id, optionArray, firstElement, func) {
    var select = document.createElement("select");
    select.id = id;
    select.appendChild(buildOption(firstElement));
    optionArray.map(buildOption).forEach(function (y) {
        select.appendChild(y);
    });
    select.addEventListener("change", func, false);
    return select;
}
function makeTable() {
    var article = firstTag("article");
    article = clearElement(article);
    article.appendChild(generateTable(globals.CAR_ATTRIBUTES_PRINT));
}
function fillTable(cars) {
    var table = $("vehiculos"),
        checkbox,
        row;
    cars.forEach(function (x) {
        row = table.insertRow();
        (x.getAllPropierties()).forEach(function (y) {
            row.insertCell().appendChild(document.createTextNode(y));
        });
        checkbox = generateInput("checkbox", x.numberPlate, "sold");
        row.insertCell().appendChild(checkbox);
    });
}
function printSelectedCar() {
    var dealerShip = dealernet.getDealerShip($("menu").value),
        selectedCars = dealerShip.getFilterCar($("select_car").value);
    makeTable();
    fillTable(selectedCars);
}
function generateChooseCar() {
    var nav = firstTag("nav"),
        models = globals.MODELS,
        select = buildSelect("select_car", models, "Todos", printSelectedCar);
    nav.appendChild(generateTextElement("h3", "Filtrar por modelo"));
    nav.appendChild(select);
}
function generateErrorMessage(error) {
    var text = generateTextElement("h4", error);
    text.id = "error_insert";
    return text;
}
function buyButton() {
    var formData = $c("datos_compra"),
        nav = firstTag("nav"),
        carValue,
        dealerShip = dealernet.getDealerShip($("menu").value),
        carAtt = globals.CAR_ATTRIBUTES.map(function (x, y) {
            carValue = this[y].value;
            this[y].value = "";
            return carValue;
        }, formData);
    if (dealerShip.checkData(carAtt) && !dealernet.hasNumberPlate(carAtt[1])) {
        dealerShip.buyCar(globals.CAR_ATTRIBUTES, carAtt);
        nav.replaceChild(generateErrorMessage(""), $("error_insert"));
        $("select_car").item(0).selected = true;
        makeTable();
        fillTable(dealerShip.cars);
    } else {
        nav.replaceChild(generateErrorMessage("Datos incorrectos"), $("error_insert"));
    }
}
function selectColor(colorClass, colors) {
    var select = document.createElement("select");
    select.setAttribute("class", colorClass);
    colors.map(buildOption).forEach(function (y) {
        select.appendChild(y);
    });
    return select;
}
function generateFormBuy() {
    var nav = firstTag("nav"),
        formData;
    nav = clearElement(nav);
    globals.CAR_ATTRIBUTES_PRINT.forEach(function (x) {
        nav.appendChild(generateTextElement("label", x));
        nav.appendChild(generateInput("text", x, "datos_compra"));
    });
    formData = $c("datos_compra")[5];
    nav.replaceChild(selectColor("datos_compra", globals.COLOR), formData);
    nav.appendChild(generatebutton(buyButton, "comprar", "Comprar"));
    generateChooseCar();
    nav.insertBefore(generateErrorMessage(""), firstTag("label"));
}
function calculateAllProfits() {
    var element = firstTag("section").firstChild,
        dealerShip = dealernet.getDealerShip($("menu").value);
    element.textContent = "Beneficios: " + dealerShip.sellProfitsAll() + " €";
    $("select_car").item(0).selected = true;
    makeTable(globals.CAR_ATTRIBUTES_PRINT);
    fillTable(dealerShip.cars);
}
function searchButton() {
    var filter = $c("color_filter"),
        dealerShip  = dealernet.getDealerShip($("menu").value),
        cars,
        filterValues = [filter[0].value, filter[1].value, filter[2].value];
    cars = dealerShip.filterColor(filterValues);
    makeTable();
    fillTable(cars);
}
function generateFormFilter() {
    var form = $("filter");
    form = clearElement(form);
    form.appendChild(selectColor("color_filter", globals.COLOR));
    form.appendChild(generateTextElement("label", "Precio Mínimo: "));
    form.appendChild(generateInput("text", "precioMin", "color_filter"));
    form.appendChild(generateTextElement("label", "Precio Máximo: "));
    form.appendChild(generateInput("text", "precioMax", "color_filter"));
    form.appendChild(generatebutton(searchButton, "buscar", "Buscar"));
}
function getSelectedCars() {
    var dealerShip = dealernet.getDealerShip($("menu").value),
        checkbox = document.getElementsByClassName("sold"),
        cars = dealerShip.getFilterCar($("select_car").value);
    return cars.filter(function (x, y) {
        return this[y].checked === true;
    }, checkbox);
}
function calculateProfitsSell() {
    var cars = getSelectedCars(),
        element = firstTag("section").firstChild,
        dealerShip = dealernet.getDealerShip($("menu").value);
    element.textContent = "Beneficios: 0";
    dealerShip.sellCars(cars);
    $("select_car").item(0).selected = true;
    makeTable(globals.CAR_ATTRIBUTES_PRINT);
    fillTable(dealerShip.cars);
}
function generateProfits() {
    var section = firstTag("section"),
        sell = generatebutton(calculateProfitsSell, "venderAll", "Vender"),
        profits = generatebutton(calculateAllProfits, "vender", "Beneficios");
    section = clearElement(section);
    section.appendChild(generateTextElement("h2", "Beneficios : 0"));
    section.appendChild(sell);
    section.appendChild(profits);
}
function generatePage() {
    var dealerShip = dealernet.getDealerShip($("menu").value),
        header = firstTag("header"),
        greting = generateTextElement("h1", "Bienvenido a " + $("menu").value);
    header.replaceChild(greting, header.lastChild);
    generateFormBuy();
    generateFormFilter();
    makeTable();
    fillTable(dealerShip.cars);
    generateProfits();
}
function startAplication() {
    var header = firstTag("header");
    header.appendChild(buildSelect("menu", globals.ZONE, "", generatePage));
    $("menu").addEventListener("change", removeFirstWhite, false);
    header.appendChild(generateTextElement("h1", "Elige un concesionario"));
}
window.onload = startAplication;