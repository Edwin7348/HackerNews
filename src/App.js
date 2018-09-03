import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const DEFAULT_QUERY = 'redux';


const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// template strings using the left hand corner `
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);



const list = [
  {
  title: 'React',
  url: 'https://facebook.github.io/react/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
  },
  {
  title: 'Redux',
  url: 'https://github.com/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
  },

  ];

  const arr = ['edwin','hannah','max'];

  function isSearched(searchTerm){
    return function(item){
      //some condition
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }
  
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
     result: null,
     searchTerm: DEFAULT_QUERY,
    
    };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSeachChange = this.onSeachChange.bind(this);
  }

 
  setSearchTopStories(result){
    this.setState({result});

  }

  //it will fetch the data after the component did mount, in the very first fetch, the defualt searchterm will be about 'redux' stories
  componentDidMount(){
    const {searchTerm} = this.state;
    //a url is the arguemnt for the built in fetch API function
    // the first step is turn the response from the fetch request into a JSON object(mandatory), then that JSON obj is set as the interal state results.
    // if there is an error when fetcing, that last catch function will run instead of the .then funcs
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`).then(response => response.json()).then(result => this.setSearchTopStories(result)).catch(error => error);
  }

  onDismiss(id){

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);

    this.setState({result: {...this.state.result, hits: updatedHits}});
  }

  onSeachChange(event){
    this.setState({searchTerm: event.target.value});

  }

  render() {
    // the <form> will have a onCHnage event that will call the compnet method onSeachChange
    // this will keep updateing the state which means updating the searchTerm stored inside the component
    // then render will keep re-rendering based on the change and it will keep trigging the filter function 
    //before the mapping of the list that displays the internal LIST
    // this new filter will accept a funtion thats outside the class so we need to pass in a higher order function
    // that returns a new function that acepts the ITEM then we can acccess it
    const {searchTerm, result} = this.state;
    console.log(result);

    if(!result){
      return null;
    }
    

    return (
      <div className="page">
        <div className ="interactions">
          <Search
            value = {searchTerm}
            onChange ={this.onSeachChange}
            >
            Search
          </Search>

        </div>

        <Table 
          list = {result.hits}
          pattern = {searchTerm}
          onDismiss = {this.onDismiss}
        />
      
        

            
      </div>
    );
  }
}


// keeps the input are props(destructed) and output = JSK 
const Search = ({value,onChange,children}) => 
    <form>
    {children}  <input type ="text" value = {value} onChange= {onChange} />
    </form>
 



 const Table = ({ list, pattern, onDismiss }) =>
 <div className="table">
   {list.filter(isSearched(pattern)).map(item =>
     <div key={item.objectID} className="table-row">
       <span style={{ width: '40%' }}>
         <a href={item.url}>{item.title}</a>
       </span>
       <span style={{ width: '30%' }}>
         {item.author}
       </span>
       <span style={{ width: '10%' }}>
         {item.num_comments}
       </span>
       <span style={{ width: '10%' }}>
         {item.points}
       </span>
       <span style={{ width: '10%' }}>
         <Button
           onClick={() => onDismiss(item.objectID)}
           className="button-inline"
         >
           Dismiss
         </Button>
       </span>
     </div>
   )}
 </div>


    
  

const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;
