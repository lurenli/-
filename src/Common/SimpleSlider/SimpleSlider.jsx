import React, {Component} from 'react';
import $ from 'jquery';
import Slider from 'react-slick';


let itemStyle = {
    width: "100%",
    height:"4.75rem",
    background: "white",
    boxShadow: "0 14px 24px 0 rgba(40,122,181,0.59)",
    borderRadius: "5px",
};
let imgStyle = {
    width: "100%",
    maxHeight:"10rem",
};
export default class SimpleSlider extends Component {
    constructor(props) {
        super(props);
        this.ToApply = this.ToApply.bind(this);
    }

    ToApply(id,name) {

    }


    render() {
        let settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        if (this.props.data.length <= 0) {
            return (<div></div>);
        } else {
            let incubatorArr = [];
            {
                (this.props.data || []).map(item =>
                    incubatorArr.push(
                        <div style={itemStyle}>
                            <img style={imgStyle} src={item}/>
                        </div>
                    )
                )
            }

            return (
                <Slider {...settings}>
                    {incubatorArr}
                </Slider>
            )
        }
    }
}
//属性默认值
SimpleSlider.defaultProps = {
    data: []
};