import {Component} from 'react';
import PropTypes from 'prop-types'; 
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMesage/errorMesage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
// char__item_selected - класс для вибраних елементів

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
        id: 0
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    clickOnItem = (id) => {
        this.props.upItemID(id)
        this.setState({
            id: id
        })
    }
    renderItems(arr){
        console.log(this.state)
        let styleForSelected = 'char__item';
        const items = arr.map(item => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            if(this.state.id === item.id){
                styleForSelected = 'char__item char__item_selected'
            }else{
                styleForSelected = 'char__item';
            }
            return (
                <li 
                    className={styleForSelected}
                    key={item.id}
                    data-id={item.id}
                    // onClick={() => this.props.upItemID(item.id)}>
                    onClick = {() => this.clickOnItem(item.id)}>
                        <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
            {items}
            </ul>   
        )
    }

    render(){
        console.log('render')
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList)

        const loadingStatus = loading ? <Spinner /> : null;
        const errorStatus = error ? <ErrorMessage /> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list ">
                    {loadingStatus}
                    {errorStatus}
                    {content}
                <button className="button button__main button__long "
                        disabled={newItemLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
   
}

CharList.propTypes = {
    upItemID: PropTypes.func
}

export default CharList;