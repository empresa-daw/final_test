// Required modules
var dealerShip,dealerNet, chai;
try {
    dealerShip = require("../../js/back-end.js"),
    dealerNet = require("../../js/back-end.js"),
    chai = require("chai");
} catch (e) {
    console.info("Required modules loaded");
}

// Functions to test
var calculateProfits = (new DealerShip("Profits")).sellProfits,
    checkData = (new DealerShip("Check")).checkData,
    coche10 = new Car(globals.CAR_ATTRIBUTES, [globals.MODELS[0], "1234-CTT", "12jan2015", 1000, 5000]),
    coche11 = new Car(globals.CAR_ATTRIBUTES, [globals.MODELS[0], "1548-CTT", "12mar2013", 5000, 1000]),
    coche20 = new Car(globals.CAR_ATTRIBUTES, [globals.MODELS[0], "1548-CTT", "12mar2013", -0, 200]),
    coche30 = new Car(globals.CAR_ATTRIBUTES, [globals.MODELS[0], "1548-CTT", "12mar2013", 5000.50, 2000.20]);
// BDD
chai.should();
// TDD 
var assert = chai.assert;

// The tests!
describe('Test Profits on null', function() {
    context('Calculate Profits', function() {
        it('should evaluate to 0 when no car', function() {
            calculateProfits().should.be.equal(2);
        });
        it('should evaluate to 0 for empty string', function() {
            calculateProfits("").should.be.equal(0);
        });
     
        it('should evaluate to 0 for string MANOLO', function() {
            calculateProfits("MANOLO").should.be.equal(0);
        });
        it('should evaluate to 0 for a number', function() {
            calculateProfits(10).should.be.equal(0);
        });
        it('should evaluate to 0 for empty array', function() {
            calculateProfits([]).should.be.equal(0);
        });
        it('should evaluate to 0 when no param', function() {
            calculateProfits().should.be.equal(0);
        });
        it('should evaluate to 0 for array car with buyprice equal -0 and sellprice 200', function() {
            calculateProfits([coche20]).should.be.equal(200);
        });
        it('should evaluate to 0 for a car with buyprice null and sellprice undefined', function() {
            calculateProfits([coche30]).should.be.equal(-3000.30);
        });
        it('should evaluate to 4000 for a valid car', function() {
            calculateProfits([coche10]).should.be.equal(4000);
        });
        it('should evaluate to 0 for 2 valid car', function() {
            calculateProfits([coche10, coche11]).should.be.equal(0);
        });
    });
    context('Check Validate Function', function() {
        it('should evaluate to false when empty numberPlate', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], , "12jan2015", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when invalid numberPlate', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "MX-123-TD", "12jan2015", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when empty sellprice', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1234-CTT", "12jan2015", , 5000]).should.be.equal(false);
        });
        it('should evaluate to false when empty date', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1234-CTT", "", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when future date', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1234-CTT", "12dec3016", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when invalid date', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1234-CTT", "12ene2015", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when empty model', function() {
            checkData(globals.CAR_ATTRIBUTES,[ ,"1234-CTT", "12jan2015", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false for invalid model', function() {
            checkData(globals.CAR_ATTRIBUTES,[ "Ferrari","1234-CTT", "12jan2015", 1000, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when empty array', function() {
            checkData(globals.CAR_ATTRIBUTES,[]).should.be.equal(false);
        });
        it('should evaluate to false when undefined sellprice', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1234-CTT", "12jan2015", undefined, 5000]).should.be.equal(false);
        });
        it('should evaluate to false when null buyprice', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1254-CTT", "12jan2015", 1000, null]).should.be.equal(false);
        });
        it('should evaluate to false when null buyprice and undefined sellprice', function() {
            checkData(globals.CAR_ATTRIBUTES,[globals.MODELS[0], "1254-CTT", "12jan2015", undefined, null]).should.be.equal(false);
        });
        it('should evaluate to true when for a correct data', function() {
            checkData(globals.CAR_ATTRIBUTES,[,"1234-CTT", "12jan2015", 1000, 5000]).should.be.equal(false);
        });
    });    
    context('Check Filter', function() {
        //Init dealerShip
        var checkDealerShip = new DealerShip(),
            filter = ['Negro', 0, 50000];

        it('should evaluate to empty  Array when no car', function() {
            checkDealerShip.filterColor(filter).should.be.empty;
        });
        it('should evaluate to [coche10] for one Car no filter', function() {
            checkDealerShip.cars.push(coche10);
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche10]);
        });
        it('should evaluate to [coche10] for two Car filter color Negro', function() {
            checkDealerShip.cars.push(coche11);
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche10]);
        });
        it('should evaluate to [coche01] filter by min price 2000', function() {
            checkDealerShip.sellCars([coche11, coche10]);
            checkDealerShip.cars.push(coche01);
            checkDealerShip.cars.push(coche10);
            filter = ['Negro', 2000, 15000];
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche01]);
        });
        it('should evaluate to [coche01, coche10] filter by min price 500', function() {
            filter = ['Negro', 500, 16000];
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche01, coche10]);
        });
        it('should evaluate to empty Array filter by min price 10000', function() {
            filter = ['Negro', 10000, 16000];
            checkDealerShip.filterColor(filter).should.be.empty;
        });
        it('should evaluate to empty Array filter by max price 500', function() {
            filter = ['Negro', 0, 500];
            checkDealerShip.filterColor(filter).should.be.empty;
        });
        it('should evaluate to [coche10] filter by max price 2000', function() {
            filter = ['Negro', 0, 2000];
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche10]);
        });
        it('should evaluate to [coche10, coche01] filter by max price 3000', function() {
            filter = ['Negro', 0, 3000];
            checkDealerShip.filterColor(filter).should.be.deep.equal([coche01, coche10]);
        });
    });
    
});
