import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';

var screenWidth = Dimensions.get("window").width;
export default class JumbledSentence extends React.Component{
    state = {
    arrangedArray: [],
    scrambledArray: []
    }
    componentDidMount(){
    this.scrambleSentence(this.props.sentence);
    // this.opacity = new Animated.Value(1);
    }
    scrambleSentence(sentence){
        if(sentence[0].length){
            let actualArray = sentence[0].trim().split(" ")
            this.len = actualArray.length
            let scrambledArray = []
            while(this.len > scrambledArray.length){
                let random = Math.floor(Math.random() * this.len)
                if(scrambledArray.includes(actualArray[random])){
                continue;
                }
                else{
                scrambledArray.push(actualArray[random])
                }
            }
            console.log(scrambledArray)
            this.setState(state => {state.scrambledArray = scrambledArray; return state;})
        }else{
            console.log("empty string")
        }
    
    }
    handleArrangedPress = async(index) => {
        let newArrangeArray = this.removeElementFromArray(this.state.arrangedArray, index)
        this.setState(state => {
            state.scrambledArray.push(state.arrangedArray[index]);
            state.arrangedArray = newArrangeArray;
            return state;
        })
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('./assets/sounds/bounce_drum.mp3'));
            await soundObject.playAsync();
        } catch (error) {
            console.log(error)
        }
    }
    handleSubmit(){
    if(this.state.arrangedArray.length == this.len){
        let response = this.state.arrangedArray.join(" ").trim();
        console.log(response)
        if(this.props.sentence.includes(response)){
            this.props.onSuccess();
        }
        else{
            this.props.onFailure();
            this.setState(state => {
                state.scrambledArray = state.arrangedArray;
                state.arrangedArray = [];
                return state;
            })
        }
    }else{
        Alert.alert(
            "Complete the answer",
            "You haven't reaaranged all the words",
            [
                { text: "OK", onPress: () => {console.log("complete the answer")} }
            ],
            { cancelable: false }
        );
    }
    
    }
    handleJumbledPress = async(index) => {
        let newJumbleArray = this.removeElementFromArray(this.state.scrambledArray, index)
        this.setState(state => {
            state.arrangedArray.push(state.scrambledArray[index]);
            state.scrambledArray = newJumbleArray;
            return state;
        })
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('./assets/sounds/pop_mouth.mp3'));
            await soundObject.playAsync();
        } catch (error) {
            console.log(error)
        }
    }
    removeElementFromArray(arr, index){
        return arr.filter((i,ind) => {
            return ind != index
        })
    }
    render(){
        // const animatedStyle = {opacity: this.opacity}
        return (
            <View>
                <View style = {{flex: 1, justifyContent: 'center'}}>
                    <Text style = {{fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginBottom: 20}}>Rearranged Sentence</Text>
                    <View style = {[styles.wordArrayStyle, {paddingLeft: 20}]}>
                    {this.state.arrangedArray.map((word,index) => {
                        return(
                            <TouchableOpacity 
                                style = {styles.wordButton} 
                                key={index} 
                                onPress = {() => {
                                    this.handleArrangedPress(index)
                                }}
                            >
                            <Text>{word}</Text>
                            </TouchableOpacity>
                        )
                        })}
                    </View>
                    <View style = {styles.lineStyle}>
                    </View>
                </View>
                {/* {this.state.scrambledArray.length ? ( */}
                    <View>
                        <Text style = {{fontWeight: 'bold', fontSize: 20, marginLeft: 10}}>Jumbled Sentence</Text>
                        <View style = {[styles.wordArrayStyle, {borderWidth: 1, backgroundColor: "#eaeaea", borderRadius: 5, padding: 10, margin: 10}]}>
                            {this.state.scrambledArray.map((word,index) => {
                            return(
                                <TouchableOpacity 
                                    style = {styles.wordButton} 
                                    key={index} 
                                    onPress = {() => {
                                        this.handleJumbledPress(index)
                                    }}
                                >
                                <Text>{word}</Text>
                                </TouchableOpacity>
                            )
                            })}
                        </View>
                    </View>
                {/* ): null} */}
                    
                
                <TouchableOpacity style = {styles.footerButton} onPress = {() => this.handleSubmit()}>
                    <Text style = {styles.footerText}>Done</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerButton: {
        borderWidth: 1, 
        padding: 5,
        width: screenWidth,
        backgroundColor: "green", 
        height: 50, 
        justifyContent: 'center', 
        borderColor: 'green'
    },
    footerText: {
        color: "white", 
        textAlign: 'center', 
        fontSize: 20
    },
    wordArrayStyle: {
        flexWrap: 'wrap', 
        flexDirection: "row"
    },
    lineStyle: {
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 15, 
        marginLeft: 20, 
        marginRight: 20
    },
    wordButton: {
        borderWidth: 1,
        padding: 10, 
        marginLeft: 5,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    }
});
  