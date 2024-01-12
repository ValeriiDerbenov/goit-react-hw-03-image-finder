import { Component } from "react";
import { Searchbar } from "./Searchbar/Searchbar";
import { Loader } from "./Loader/Loader";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { fetchPhoto, onFetchError } from './api/api';
import css from './App.module.css';
import { Notify } from "notiflix";
import { Modal } from "./Modal/Modal";
import { Button } from "./Button/Button";

export const paramsForNotify = {
  position: 'center-center',
  timeout: 3000,
  width: '400px',
  fontSize: '24px',
};
const perPage = 12;


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

   componentDidUpdate(_, prevState) {
    const prevSearch = prevState.search;
    const prevPage = prevState.page;
    const newSearch = this.state.search;
    const newPage = this.state.page;

    if (prevSearch !== newSearch || prevPage !== newPage) {
      this.addPhotoPage(newSearch, newPage);
    }
  }

  
  addPhotoPage = (search, page) => {
    this.setState({ loading: true });

    fetchPhoto(search, page, perPage)
      .then(data => {
        const { totalHits } = data;
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalHits === 0) {
          return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            paramsForNotify
          );
        }

        const arrPhotos = data.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );

        this.setState(prevState => ({
          photos: [...prevState.photos, ...arrPhotos],
        }));

        if (totalPage > page) {
          this.setState({ btnLoadMore: true });
        } else {
          Notify.info(
            "We're sorry, but you've reached the end of search results.",
            paramsForNotify
          );
          this.setState({ btnLoadMore: false });
        }
      })
      .catch(onFetchError)
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onClickRender = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  onClickOpenModal = event => {
    const { photos } = this.state;
    const imageId = event.target.getAttribute('data-id');
    const selectedPhoto = photos.find(photo => photo.id === Number(imageId));
    this.setState({ selectedPhoto });

    this.toggleModal();
  };

  onSubmitSearchBar = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const searchValue = form.search.value
      .trim()
      .toLowerCase()
      .split(' ')
      .join('+');

    if (searchValue === '') {
      Notify.info('Enter your request, please!', paramsForNotify);
      return;
    }

    if (searchValue === this.state.search) {
      Notify.info('Enter new request, please!', paramsForNotify);
      return;
    }

    this.setState({
      search: searchValue,
      page: 1,
      photos: [],
    });

    // form.reset();
  };


  render() { 
    // const { loading, photos, btnLoadMore, showModal, selectedPhoto } =
    //   this.state;
    return (
     <div>
      {/* <h1>Image finder</h1> */}
      <Searchbar onSubmitSearchBar={this.onSubmitSearchBar} />
      {this.state.loading && <Loader />}
      <div className={css.container}>
          <ImageGallery
            photos={this.state.photos}
            onClickImageItem={this.onClickOpenModal}
          />
        </div>
        {this.state.photos.length !== 0 && this.state.btnLoadMore && (
          <Button onClickRender={this.onClickRender} />
        )}
        {this.state.showModal && (
          <Modal selectedPhoto={this.state.selectedPhoto} onClose={this.toggleModal} />
        )}
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
