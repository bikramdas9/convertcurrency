import { LightningElement ,track,wire} from 'lwc';
import getExchangeRate from '@salesforce/apex/ExangeRatesConveter.getExchangeRate'
import Currencies_Type from "@salesforce/apex/ExangeRatesConveter.getCurrencies";
export default class ConvertCurrency extends LightningElement {

    showoutput1=false;
    showoutput2=false;
    convertedValue="";
    tocurrency="";
    fromcurrency="";
    enteredamount="";
    currencyOptions=[];
    errorMessageDisplay = "";
    @track Rate=""
    @track symbol=""
    @track l_All_Types;
    @track FromTypeOptions;
    @track ToTypeOptions;

    @wire(Currencies_Type,{})
    WiredCurrencies_Type({ error, data }) {
        console.log('Data12--->'+JSON.stringify(data));
        if (data) {
            try {
                this.l_All_Types = data; 
                let options = [];
                let optionList = JSON.parse(data);
                
                for (var key in optionList) {
                    console.log('Key-->'+key);
                    console.log('data-->'+optionList[key]);
                    let labels = optionList[key] + '(' + key +')';
                    options.push({ label: labels, value: key  });
 
                    // Here Name and Id are fields from sObject list.
                }
                this.ToTypeOptions = options;
                this.FromTypeOptions = options;
                 
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
 
    }

    handler(event)
    {
        let {name,value}=event.target;

        if(name==="amount")
        {
            this.enteredamount=value;
        }
        else if(name==="fromcurr")
        {
            this.fromcurrency=value;
        }
        else if(name==="Tocurr")
        {
            this.tocurrency=value;
        }
    }

    ClickHandler()
    {
          
        getExchangeRate({ 
            amount:this.enteredamount,
            fromCurrency:this.fromcurrency,
            toCurrency:this.tocurrency,
            
        })
        .then((result) => {
                if(this.fromcurrency == this.tocurrency)
                    {
                        this.errorMessageDisplay = "Please select diffarent from and to currency";
                        this.showoutput2=true;
                        this.showoutput1=false;
                    }
                    else
                    {
                        this.showoutput1=true;
                        this.showoutput2=false;
                        const response=JSON.parse(result);
                        const amount = response.amount;
                        const baseCurrency = response.base;
                        const date = response.date;
                        this.Rate = response.rates[this.tocurrency];
                        this.symbol=this.tocurrency;
                        console.log('datajosn', JSON.stringify(response));
                        console.log('Amount:', amount);
                        console.log('Base Currency:', baseCurrency);
                        console.log('Date:', date);
                        console.log(' Rate:', this.Rate);
                    }
                

        })
        .catch((error) =>{
                
                console.log('Some error occurred while fetching  details');
                this.showoutput1=false;
        });
    }
    Clickreset(event)
    {
        this.showoutput1=false;
        this.enteredamount=" "
        this.fromcurrency=" "
        this.tocurrency=" "
        this.template.querySelector('form').reset();
        this.template.querySelectorAll('lightning-combobox').forEach(each => {
            each.value = undefined;
        });
    }

    handleTypeChange(event){
        if(event.target.name == 'fromcurr')
            {
                this.fromcurrency = event.target.value;
                console.log('form'+this.fromcurrency);
            }
            if(event.target.name == 'Tocurr')
            {
                this.tocurrency = event.target.value;
                console.log('to'+this.tocurrency);
            }
    }
     
}