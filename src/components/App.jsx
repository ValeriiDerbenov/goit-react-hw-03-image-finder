import { Component } from "react";
import { Searchbar } from "./Searchbar/Searchbar";

export class App extends Component {
  state = { 
    search: '',
    photos: [],
    page: 1,
    loading: false,
    btnLoadMore: false,
    showModal: false,
    selectedPhoto: null
   } 
  render() { 
    // const { loading, photos, btnLoadMore, showModal, selectedPhoto } =
    //   this.state;
    return (
     <div>
      {/* <h1>Image finder</h1> */}
      <Searchbar onSubmitSearchBar={this.onSubmitSearchBar} />
     </div>
    );
  }
}
 




// export const App = () => {
//   return (
//     <div
//       style={{
//         height: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontSize: 40,
//         color: '#010101'
//       }}
//     >
//       React homework template
//     </div>
//   );
// };
