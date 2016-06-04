/*jslint
    node: true,
    browser: true,
    unparam: true
*/
'use strict';
var globals = (function (ns) {
    ns.ZONE = ["Norte", "Sur", "Este", "Oeste"];
    ns.MODELS = ["Basic", "Homing", "Transper", "BerlinX", "MaximV8"];
    ns.CAR_ATTRIBUTES_PRINT = ["Modelo", "Matricula", "Fecha última revisión",
        "Precio de compra", "Precio de venta", "Color"];
    ns.CAR_ATTRIBUTES = ["model", "numberPlate", "dateLastrevDate",
        "buyPrice", "sellPrice", "color"];
    ns.COLOR = ["Blanco", "Negro", "Rojo", "Verde", "Azul", "Otro"];
    ns.MONTH_STRING = "janfebmaraprmayjunjulaugsepoctnovdec";
    return ns;
}({}));
function checkNumberPlate(numberPlate) {
    var template = new RegExp("^[0-9]{4}[-]{1}[A-Z]{3}$|" +
        "^[A-Z]{1,2}[-]{1}[0-9]{4}[-]{1}[A-Z]{1,2}$", "i");
    return (template.test(numberPlate));
}
function checkModel(model) {
    var check = globals.MODELS.some(function (x) {
        return x === model;
    });
    return check;
}
function checkPrice(price) {
    return price > 0;
}
function checkLastTrevDate(date) {
    var template = new RegExp("^[0-9]{2}[A-Z]{3}[0-9]{4}$", "i"),
        dateInsert,
        validDate,
        day = date[0] + date[1],
        month = date[2] + date[3] + date[4],
        year = date[5] + date[6] + date[7] + date[8],
        monthNumber = (globals.MONTH_STRING.indexOf(month) / 3),
        validDay = (day > 0 && day <= 31),
        invalidMonth = (globals.MONTH_STRING.indexOf(month)) % 3;
    if (!invalidMonth && validDay && year > 0 && template.test(date)) {
        dateInsert = new Date(year, monthNumber, day);
        validDate = dateInsert < new Date();
    } else {
        validDate = false;
    }
    return validDate;
}
function checkColor(color) {
    var check = globals.COLOR.some(function (x) {
        return x === color;
    });
    return check;
}
function Car(attributes, values) {
    attributes.forEach(function (x, y) {
        this[x] = values[y];
    }, this);
}
Car.prototype.getAllPropierties = function () {
    return globals.CAR_ATTRIBUTES.map(function (x) {
        return this[x];
    }, this);
};
function DealerShip(zone) {
    this.zone = zone;
    this.cars = [];
}
DealerShip.prototype.checkValues = function (values, ArrayFunctions) {
    var check = values.every(function (x, y) {
        return this[y](x);
    }, ArrayFunctions);
    return check;
};
DealerShip.prototype.filterColor = function (filterValues) {
    var color = filterValues[0],
        min = +filterValues[1],
        max = +filterValues[2];
    return this.cars.filter(function (x) {
        return ((x.color === color) && ((x.buyPrice <= max) && (x.buyPrice >= min)));
    });
};


DealerShip.prototype.getCarByNumberPlate = function (numberPlate) {
    this.cars.find(function (x) {
        return x.numberPlate === numberPlate;
    });
};
DealerShip.prototype.findNumberPlate = function (numberPlate) {
    return this.cars.some(function (cars) {
        return cars.numberPlate === numberPlate;
    });
};
DealerShip.prototype.sellProfits = function (cars) {
    var profits = 0;
    if (cars && cars.length && Array.isArray(cars)) {
        profits = cars.map(function (x) {
            return x.sellPrice - x.buyPrice;
        }).reduce(function (x, y) {
            return x + y;
        });
    } else {
        profits = 0;
    }
    return profits;
};
DealerShip.prototype.sellProfitsAll = function () {
    return DealerShip.prototype.sellProfits.bind(this, this.cars).call();
};
DealerShip.prototype.getFilterCar = function (model) {
    return model === "Todos" ? this.cars : this.cars.filter(function (x) {
        return x.model === model;
    });
};
DealerShip.prototype.deleteForNumberPlate = function (numberP) {
    this.cars.delete(this.getCarByNumberPlate(numberP));
};
DealerShip.prototype.sellCars = function (carsSold) {
    carsSold.forEach(function (x) {
        this.splice(this.indexOf(x), 1);
    }, this.cars);
};
DealerShip.prototype.checkData = function (carsAtt) {
    var check = [checkModel, checkNumberPlate, checkLastTrevDate,
        checkPrice, checkPrice, checkColor];
    return check.every(function (x, y) {
        return x(this[y]);
    }, carsAtt);
};
DealerShip.prototype.buyCar = function (attributes, values) {
    this.cars.push(new Car(attributes, values));
};
function DealerNet() {
    this.Dealer = globals.ZONE.map(function (x) {return new DealerShip(x); });
}
DealerNet.prototype.hasNumberPlate = function (number) {
    return this.Dealer.some(function (DealerShip) {
        return DealerShip.findNumberPlate(number);
    });
};
DealerNet.prototype.getDealerShip = function (zone) {
    return this.Dealer.find(function (x) {
        return x.zone === zone;
    });
};
var dealernet = new DealerNet();