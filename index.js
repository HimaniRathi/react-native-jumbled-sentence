import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { Audio } from 'expo-av';

var screenWidth = Dimensions.get("window").width;
export default class JumbledSentence extends React.Component{
    state = {
    arrangedArray: [],
    scrambledArray: []
    }
    componentDidMount(){
    this.scrambleSentence(this.props.sentenceToJumble[0]);
    }
    scrambleSentence(sentence){
        if(sentence.length){
            this.actualArray = sentence.trim().split(" ")
            this.len = this.actualArray.length
            let scrambledArray = this.actualArray.map(e => {return e});
            for (let i = scrambledArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = scrambledArray[i];
                scrambledArray[i] = scrambledArray[j];
                scrambledArray[j] = temp;
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
        if(this.props.sentenceToJumble.includes(response)){
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
        return (
            <View>
                <View style = {{flex: 1, justifyContent: 'center', flexDirection: "column"}}>
                    {this.props.hint ? (
                        <View style = {{flex: 0.5}}>
                            <Text style = {[styles.blockHeading, {marginTop: 40}]}>{this.props.hint.title ? this.props.hint.title : null}</Text>
                            <Text style = {[styles.wordArrayStyle,{fontSize: 18}]}>{this.props.hint.description ? this.props.hint.description : null}</Text>
                        </View>
                    ): null}
                    
                    <View style = {{flex: 0.5}}>
                        <Text style = {[styles.blockHeading]}>Rearranged Sentence</Text>
                        <View style = {styles.wordArrayStyle}>
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
                    </View>
                    
                </View>
                {/* {this.state.scrambledArray.length ? ( */}
                    <View>
                        <Text style = {styles.blockHeading}>Jumbled Sentence</Text>
                        <View style = {styles.wordArrayStyle}>
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
                    <Text style = {styles.footerText}>Check</Text>
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
        flexDirection: "row",
        borderWidth: 1, 
        backgroundColor: "#eaeaea", 
        borderRadius: 5, 
        padding: 10, 
        margin: 10, 
        borderColor: "#eaeaea"
    },
    blockHeading: {
        fontWeight: 'bold', 
        fontSize: 20, 
        marginLeft: 10
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
  