// Budget Controller
const budgetController = (function () {

    // Expense Constructor
    const Expense = function (id, description, value) {
        this.description = description;
        this.id = id;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }
    // Income constructor
    const Income = function (id, description, value) {
        this.description = description;
        this.id = id;
        this.value = value;
    };

    // Creating a function for calculating total of an array             => Similar to the python dict syntax (for accessing the properties of Object)
    const calculateTotal = (type) => {                                      //myCar['make'] = 'Ford';
        let sum = 0;                                                        //myCar['year'] = 1969;
        data.allItems[type].forEach((data) => {                             //myCar['model'] = 'Mustang';
            sum = sum + data.value;                                         // console.log(myCar['make'])
        });
        data.totals[type] = sum;
    }

    // Creating our data structure
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        // Adding a new Item to the Data structure
        addItem: function (type, des, val) {
            let ID, newItem;

            // Creates new ID for the new Item
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new Item based on 'inc or 'exp.
            if(type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else {
                newItem = new Income(ID, des, val)
            }

            // Push it to our Data structure
            data.allItems[type].push(newItem)

            // Return the new element
            return newItem;
        },

        deleteItem: (type, id) => {
            const ids = data.allItems[type].map((data) => {
                return data.id;
            })

            const index = ids.indexOf(id)

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {

            // Calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // Calculate the budget : income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of expense
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }

            // Update the budget to the UI

        },

        calculatePercentages: () => {
            data.allItems.exp.forEach((cur) => {
                cur.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: () => {
            return data.allItems.exp.map((data) => {
                return data.getPercentage()
            });
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: () => {
            console.log(data);
        }

    }
}) ();

// UI Controller
const UIController = (function () {
    // Basically return all the functions that u want to be public in a return statement which returns an object of all methods
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        expensesLabel: '.budget__expenses--value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    const nodeListForEach = (list, callback) => {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    const formatNumber = (number, type) => {
        let sign;
        number = Math.abs(number);
        // For generating a number with 2 decimals
        number = number.toFixed(2);

        const numSplit = number.split('.')
        let int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        const dec = numSplit[1];
        if (type === 'exp') {
            sign = '-';
        } else {
            sign = '+';
        }
        return sign + ' ' + int + '.' + dec;
    }

    return {
        // getInput returns the object of all inputs
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        clearFields: function() {
            let fields,fieldsArray ;
            fields =  document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach((field) => {
                field.value = '';
            });

            fieldsArray[0].focus();
        },

        getDOMstrings: function () {
            return DOMStrings;
        },

        addListItem: function (obj, type) {
            let html, newHTML;
            let element;
            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">' +
                    '       <div class="item__description">%description%</div>' +
                    '       <div class="right clearfix">' +
                    '           <div class="item__value">%value%</div>' +
                    '           <div class="item__delete">' +
                    '               <button class="item__delete--btn">' +
                    '                   <i class="ion-ios-close-outline"></i>' +
                    '               </button>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>'
            } else {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">' +
                    '       <div class="item__description">%description%</div>' +
                    '       <div class="right clearfix">' +
                    '           <div class="item__value">%value%</div>' +
                    '           <div class="item__percentage">21%</div>' +
                    '           <div class="item__delete">' +
                    '               <button class="item__delete--btn">' +
                    '                   <i class="ion-ios-close-outline"></i>' +
                    '               </button>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>'
            }

            // Replace placeholder text with actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
        },

        deleteListItem: (selectorId) => {
            const el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        displayPercentages: (percentages) => {
           const fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

           nodeListForEach(fields, (current, index) => {
               if (percentages[index] > 0){
                   current.textContent = percentages[index] + '%';
               } else {
                   current.textContent = '---';
               }
           });
        },

        displayMonth: () => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year.toString();
        },

        displayBudget: (obj) => {
            let type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        changedType: () => {
            const fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputValue + ',' + DOMStrings.inputDescription);
            const  btn = document.querySelector(DOMStrings.inputBtn)
            btn.classList.toggle('red');
            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus');
            })
        }
    }
}) ();

//App Controller
const controller = (function (budgetCtrl, UICtrl) {

    // Setting up our event listeners
    const setUpEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', (event) => {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    const updateBudget = () => {

        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        const budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    const updatePercentages = () => {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        const percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    }

    // Everything related to adding an item goes here
    const ctrlAddItem = () => {

        // 1. get the field input data
        const input = UICtrl.getInput()

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {  // Added if statement so that we do not have useless data
            // 2. Add the item to the budget controller
            const newItem = budgetController.addItem(input.type, input.description, input.value)

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the fields
            UICtrl.clearFields()

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate Percentages
            updatePercentages();
        }
    }

    const ctrlDeleteItem = (event) => {
        // Event Delegation well explained in the Lecture refer it for any doubts
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID) {
            // Getting the ID here
            const splitID = itemID.split('-');
            const type = splitID[0];
            const ID = parseInt(splitID[1]);

            // 1. Delete  Item from the Data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete it from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update the Budget
            updateBudget();

            // 4. Update Percentages
            updatePercentages();
        }
    }
    return {
        init: function () {
            console.log('Application has started')
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }
}) (budgetController, UIController);

controller.init();