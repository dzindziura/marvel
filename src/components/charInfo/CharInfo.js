import { Component } from 'react';
import Skeleton from '../skeleton/Skeleton';
import PropTypes from 'prop-types'; 

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMesage/errorMesage';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {
    constructor(props){
        super(props);
    }
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        // console.log('mount');

        this.updateChar();
    }

    componentDidUpdate(prevProps){
        // console.log('update');
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    onCharLoandind = () => {
        this.setState({
            loading: true
        })
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }
    onErrorMesage = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    updateChar = () => {
        const {charId} = this.props;
        if(!charId){
            return;
        }
        this.onCharLoandind();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onErrorMesage)
    }

    render(){
        // console.log('render');

        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description,thumbnail,homepage,wiki,comics} = char;
    let style = {};
    if(thumbnail.split('/')[10] === 'image_not_available.jpg'){
         style = {
            'objectFit': 'contain'
        }
    }
    return (
        <>
                   <div className="char__basics">
                    <img src={thumbnail} alt={name} style={style}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">Homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'Comics not found'}
                    {comics.map((item, i)=>{
                        if(i > 9){
                            return;
                        }                        
                        return (
                            <li className="char__comics-item"
                            key={i}>
                                <a href={item.resourceURI}>{item.name}</a>
                            </li>
                        )
                    })}

                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId : PropTypes.number
}

export default CharInfo;