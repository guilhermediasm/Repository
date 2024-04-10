import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Routes} from './Routes';

type Props = NativeStackScreenProps<Routes, 'HomePage'>;
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const useAnimatedStates = (numberOfItems: number) => {
  const animations: Animated.Value[] = Array.from(
    {length: numberOfItems},
    () => new Animated.Value(0),
  );
  return animations;
};

const HomePage = ({navigation}: Props): React.ReactElement => {
  const numberOfItems = 3; // Defina o número de itens conforme necessário
  const animations = useAnimatedStates(numberOfItems);

  const handlePress = (index: number) => {
    const animation = animations[index];

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    if (index === 0) {
      navigation.navigate('Cadastrar');
    } else if (index === 1) {
      navigation.navigate('CadastrarItem');
    } else if (index === 2) {
      navigation.navigate('CadastrarCor');
    }
  };

  const getBoxStyle = (index: number) => {
    return {
      backgroundColor: animations[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['white', 'red'],
      }),
    };
  };

  const getColorIconStyle = (index: number) => {
    return animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['red', 'white'],
    });
  };

  const getColorTextStyle = (index: number) => {
    return {
      color: animations[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['#333', '#e1e1e1'],
      }),
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={() => handlePress(0)}>
        <Animated.View style={[styles.box, getBoxStyle(0)]}>
          <AnimatedIcon name="store" size={50} color={getColorIconStyle(0)} />
          <Animated.Text style={[styles.titleBox, getColorTextStyle(0)]}>
            Cadastrar Produto
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={() => handlePress(1)}>
        <Animated.View style={[styles.box, getBoxStyle(1)]}>
          <AnimatedIcon name="tags" size={50} color={getColorIconStyle(1)} />
          <Animated.Text style={[styles.titleBox, getColorTextStyle(1)]}>
            Inventario
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={() => handlePress(2)}>
        <Animated.View style={[styles.box, getBoxStyle(2)]}>
          <AnimatedIcon
            name="paint-brush"
            size={50}
            color={getColorIconStyle(2)}
          />
          <Animated.Text style={[styles.titleBox, getColorTextStyle(2)]}>
            Cadastrar Cor
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>

      {numberOfItems % 2 > 0 && <View style={styles.boxExtra} />}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  boxExtra: {
    minHeight: 150,
    minWidth: 150,
    marginVertical: 10,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    minWidth: 150,
    borderRadius: 25,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6,
    marginVertical: 10,
  },
  titleBox: {marginTop: 20},
});
