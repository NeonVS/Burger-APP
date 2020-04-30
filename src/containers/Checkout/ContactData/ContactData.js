import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
class ContactData extends Component{
    state={
        orderForm:{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'ZIP CODE'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:6,
                    maxLength:6
                },
                valid:false,
                touched:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your E-Mail'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[
                        {value:'fastest',displayValue:'Fastest'},
                        {value:'cheapest',displayValue:'Cheapest'},]
                },
                value:'fastest',
                validation:{},
                valid:true
            }
        },
            formIsValid:false
    }
    orderHandler = (event)=>{
        event.preventDefault();
        this.setState({loading:true});
        const order ={
            ingredients:this.props.ingredients,
            price:this.props.price,
            customer:{
                name:'Vishu Saxena',
                address:{
                    street:'Street -1 New Bay',
                    zipcode:'564646',
                    country:'INDIA'
                },
            email:'vishu@gmail.com',
            deliveryMethod:'fastest'
            }
        };
        console.log(order);
        axios.post('/orders.json',order)
        .then(response=>{
            console.log(response);
            this.setState({loading:false});
            this.props.history.push('/');
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
        });  
    }

    checkValidity(value,rules){
        let isValid = true;
        if(!rules){
            return true;
        }
        if(rules.required){
            if(isValid)
                isValid = value.trim() !== '';
        }
        if(rules.minLength){
            if(isValid)
                isValid = value.length >= rules.minLength;
        }
        if(rules.maxLength){
            if(isValid)
                isValid = value.length <= rules.maxLength;
        }
        return isValid;
    }

    inputChangedHandler = (event,inputIdentifier)=>{
         const updatedOrderForm = {
             ...this.state.orderForm
         }
         const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
         updatedFormElement.value = event.target.value;
         updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
         updatedFormElement.touched = true;
         updatedOrderForm[inputIdentifier] = updatedFormElement;
         let formIsValid = true;
         for(let inputIdentifier in updatedOrderForm){
             formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
         }
         console.log(formIsValid);
         this.setState({orderForm:updatedOrderForm,formIsValid:formIsValid});
    }

    render(){
        const formElementArray = [];
        for(let key in this.state.orderForm){
            formElementArray.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }
        console.log(this.state.formIsValid);
        let form = (
        <form>
            {formElementArray.map(formElement =>(
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value} 
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event)=>this.inputChangedHandler(event,formElement.id)}
                    invalid={!formElement.config.valid}/>
            ))}
            <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
        );
        if(this.state.loading){
            form =<Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    };
}   

export default ContactData;