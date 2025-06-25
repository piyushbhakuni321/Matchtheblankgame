import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import Svg, { Line } from 'react-native-svg';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function App() {

 const levels = [
    {
      leftItems: [
        { id: 'apple', name: 'Apple', image: require("./assets/apple.png"), position: { x: 145, y: 200 } },
        { id: 'ball', name: 'Ball', image: require("./assets/ball.png"), position: { x: 145, y: 280 } }
      ],
      rightItems: [
             { id: 'ball-match', name: 'Ball', matches: 'ball', position: { x: 350, y: 200 } },
        { id: 'apple-match', name: 'Apple', matches: 'apple', position: { x: 350, y: 280 } }
      ]
    },
    {
      leftItems: [
        { id: 'Dog', name: 'Dog', image: require("./assets/Frame.png"), position: { x: 145, y: 200 } },
        { id: 'Cat', name: 'Cat', image: require("./assets/Frame (1).png"), position: { x: 145, y: 280 } }
      ],
      rightItems: [
        { id: 'cat-match', name: 'Cat', matches: 'Cat', position: { x: 350, y: 200 } },
        { id: 'dog-match', name: 'Dog', matches: 'Dog', position: { x: 350, y: 280 } }  
      ]
    }
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [connections, setConnections] = useState([]);

  const leftItems = levels[levelIndex].leftItems;
  const rightItems = levels[levelIndex].rightItems;

  const handleLeftItemPress = (item) => {
    setSelectedLeft(item);
    if (selectedRight) {
      createConnection(item, selectedRight);
    }
  };

  const handleRightItemPress = (item) => {
    setSelectedRight(item);
    if (selectedLeft) {
      createConnection(selectedLeft, item);
    }
  };

  const createConnection = (leftItem, rightItem) => {
    const existingConnection = connections.find(
      conn => conn.left.id === leftItem.id && conn.right.id === rightItem.id
    );

    if (!existingConnection) {
      const newConnection = {
        left: leftItem,
        right: rightItem,
        isCorrect: rightItem.matches === leftItem.id
      };

      setConnections([...connections, newConnection]);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

 const handleNext = async () => {
  const correctMatches = connections.filter(c => c.isCorrect).length;
  const incorrectMatches = connections.length - correctMatches;

  try {
    await addDoc(collection(db, "gameResults"), {
      level: levelIndex + 1,
      timestamp: Timestamp.now(),
      totalMatches: connections.length,
      correctMatches,
      incorrectMatches,
      connections: connections.map(conn => ({
        left: conn.left.name,
        right: conn.right.name,
        isCorrect: conn.isCorrect,
      }))
    });
    console.log("Game data saved to Firestore");
  } catch (error) {
    console.error("Error saving game data:", error);
  }

  if (levelIndex < levels.length - 1) {
    setLevelIndex(prev => prev + 1);
    setConnections([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  } else {
    setGameFinished(true);
  }
};





  const getItemStyle = (item, isLeft) => {
    return [styles.itemContainer];
  };

  const allMatched = leftItems.length === connections.length;
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Cognitii Game</Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => {
          setGameStarted(true);
        }}>
          <Text style={{ color: "#fff" }}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameFinished) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Game Finished!</Text>
      <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20 }}>
        Thanks for playing the Cognitii Game.
      </Text>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          setGameFinished(false);
          setLevelIndex(0);
          setConnections([]);
          setSelectedLeft(null);
          setSelectedRight(null);
          setGameStarted(true); 
        }}
      >
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (

    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton}>
        <Image
          source={require("./assets/home.png")}
          style={styles.homeIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.title}>Can you match what goes together?</Text>

      <View style={styles.gameArea}>
        <View style={styles.leftColumn}>
          {leftItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={getItemStyle(item, true)}
              onPress={() => handleLeftItemPress(item)}
            >
              <Image source={item.image} style={styles.iconImage} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.connectionArea}>
          <Svg height="300" width="200" style={styles.svgContainer}>
            {connections.map((connection, index) => (
              <Line
                key={index}
                x1="5"
                y1={connection.left.position.y - 150}
                x2="95"
                y2={connection.right.position.y - 150}
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />

            ))}
          </Svg>
          <View style={styles.dotsContainer}>
            {leftItems.map((item, index) => (
              <View key={`left-${item.id}`} style={[styles.dotRow, { top: index * 82 + 45 }]}>
                <View style={[styles.dot, { marginLeft: 38 }]} />
                <View style={[styles.dot, { marginLeft: 88 }]} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rightColumn}>
          {rightItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={getItemStyle(item, false)}
              onPress={() => handleRightItemPress(item)}
            >
              <Text style={styles.labelBox}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {allMatched && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Image
            source={require("./assets/arrow.png")}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}


      <TouchableOpacity style={styles.soundButton}>
        <Ionicons name="volume-high" size={26} color="#55698f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 40,
    marginTop: 80,
    textAlign: "center",
    color: "#1a1a1a",
  },
  container: {
    flex: 1,
    backgroundColor: "#fef1c8",
    paddingVertical: 40,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
  },
  connectionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemContainer: {
    padding: 15,
    marginBottom: 15,
    marginTop: 0,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dotsContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  dotRow: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
    borderRadius: 3,
  },
  labelBox: {
    fontSize: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    fontWeight: "500",
    minWidth: 80,
    textAlign: "center",
  },
  nextButton: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#7777f7",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 22,
    paddingRight: 22,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "center",
  },
  homeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#899eb6",
    borderRadius: 30,
    padding: 12,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIcon: {
    width: 20,
    height: 20,
  },
  soundButton: {
    position: "absolute",
    bottom: 30,
    left: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowIcon: {
    width: 17,
  },
});
