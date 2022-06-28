import { Component } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMesage/errorMesage';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

class RandomChar extends Component {
    constructor(props){
        super(props);
    }
    state = {
        char: {},
        loaded: true,
        error: false
    }
    marvelService = new MarvelService();
    random = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

    componentDidMount() {
        // this.foo.bar = 0;
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onCharLoandind = () => {
        this.setState({
            loaded: true
        })
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loaded: false
        })
    }
    onErrorMesage = () => {
        this.setState({
            loaded: false,
            error: true
        })
    }
    updateChar = (id = this.random) => {
        this.onCharLoandind();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onErrorMesage)
    }
    randomCharacter = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.updateChar(id);
    }
    render(){
        const {char, loaded, error} = this.state;
        const errorMesageValue = error ? <ErrorMessage /> : null;
        const loadedValue = loaded ? <Spinner /> : null;
        const content = !(loaded || error) ? <View char={char} /> : null;
        return (
            <div className="randomchar">
                {errorMesageValue}
                {loadedValue}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main"
                            onClick={this.randomCharacter}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

}

const View = ({char}) => {
    const {name, description,thumbnail,homepage,wiki} = char;
    let style = {};
    if(thumbnail.split('/')[10] === 'image_not_available.jpg'){
         style = {
            'objectFit': 'contain'
        }
    }
    let descriptionNew = description;
    if(descriptionNew != undefined ){
        descriptionNew = `${descriptionNew.substr(0, 100)} ...`;
    };
    if(description === ''){
        descriptionNew = 'There is no description';
    }
    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={style}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {descriptionNew}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
}

export default RandomChar;