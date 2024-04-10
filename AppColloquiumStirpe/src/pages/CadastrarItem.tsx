import {NativeStackScreenProps} from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Modalize} from 'react-native-modalize';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Routes} from './Routes';
import {ScrollView} from 'react-native-gesture-handler';
import {get} from '../services/api';

type ShowSecao = {
  NumeroSecao: number;
  Quantidade: number;
}[];

type ResponseShowSecao = {
  data: ShowSecao;
  message: string;
};

type Props = NativeStackScreenProps<Routes, 'CadastrarItem'>;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const useAnimatedStates = (numberOfItems: number) => {
  const animations: Animated.Value[] = Array.from(
    {length: numberOfItems},
    () => new Animated.Value(0),
  );
  return animations;
};

const Cadastrar = ({navigation}: Props): React.ReactElement => {
  const modalizeRef = useRef<Modalize>(null);
  const numberOfInputs = 6; // Altere conforme necessário
  const inputStates = useAnimatedStates(numberOfInputs);
  const [secao, setSecao] = useState<number>(0);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSecao, setDataSecao] = useState<ShowSecao>([]);

  const handleInputFocus = (input: number, focusValue: number) => {
    Animated.timing(inputStates[input], {
      toValue: focusValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getInputStyle = (index: number) => {
    return {
      borderBottomColor: inputStates[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['#ddd', index % 2 === 0 ? '#ff5e57' : '#00b894'],
      }),
      color: '#333',
      fontSize: inputStates[index].interpolate({
        inputRange: [0, 1],
        outputRange: [16, 20],
      }),
    };
  };

  const handleNavigationSecao = (secaoC: number) => {
    navigation.navigate('SecaoPage', {secao: secaoC});
  };

  const handleNavigation = () => {
    return Alert.alert(
      'Atenção',
      `Todas as peças seram adicionadas a seção: ${secao}`,
      [
        {text: 'Trocar seção', onPress: () => {}},
        {
          text: 'Continuar',
          onPress: () => {
            modalizeRef.current?.close();
            navigation.navigate('CodeScannerPage', {secao});
          },
        },
      ],
    );
  };

  const getData = useCallback(async () => {
    try {
      setShowLoading(true);
      const response = await get<ResponseShowSecao>('/api/v1/showSecao');
      setShowLoading(false);

      setDataSecao(response.data);
    } catch ({response}: any) {
      setShowLoading(false);
      Alert.alert('Atenção', response.data.message, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        color={'black'}
        size={20}
        style={{margin: 20}}
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={{marginHorizontal: 20}}>
        <View style={styles.secaoItemTitle}>
          <Text style={styles.titleSecao}>Seção</Text>
          <Text style={styles.titleSecao}>Quatidade de peças</Text>
        </View>
        {showLoading && <Text style={{color: '#c3c3c3'}}>carregando ...</Text>}
        {!showLoading &&
          dataSecao?.map(item => (
            <TouchableOpacity
              onPress={() => handleNavigationSecao(item.NumeroSecao)}
              key={item.NumeroSecao}
              style={styles.listSecao}>
              <Text style={styles.item}>{item.NumeroSecao}</Text>
              <View style={styles.row}>
                <Text style={styles.item}>{item.Quantidade}</Text>

                <Icon
                  name="chevron-right"
                  color={'black'}
                  size={10}
                  style={{marginLeft: 20}}
                  onPress={() => navigation.goBack()}
                />
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={{marginHorizontal: 20}}>
        <TouchableOpacity
          onPress={() => modalizeRef.current?.open()}
          style={styles.button}>
          <Text style={styles.textButton}>Inciar seção</Text>
        </TouchableOpacity>
      </View>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <View style={{padding: 20}}>
          <Text style={{color: '#333', fontSize: 20}}>Seção</Text>
          <View style={styles.basic}>
            <AnimatedTextInput
              key={1}
              onChangeText={n => setSecao(+n)}
              value={secao.toString()}
              style={[styles.input, getInputStyle(1)]}
              onFocus={() => handleInputFocus(1, 1)}
              onBlur={() => handleInputFocus(1, 0)}
              placeholder={'Número da seção'}
              placeholderTextColor={'#333'}
            />
            <View style={styles.editSecao}>
              <TouchableOpacity
                onPress={() => {
                  secao > 0 ? setSecao(secao - 1) : setSecao(0);
                }}
                style={styles.menos}>
                <Text style={[styles.textMenos]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSecao(secao + 1)}
                style={styles.mais}>
                <Text style={styles.textMais}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginVertical: 20}}>
            <Text style={{color: '#333'}}>
              Ainda não foi adicinado nem um item há seção
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleNavigation()}
            style={styles.adicionar}>
            <Icon name="barcode" color={'black'} size={20} />
            <Text style={styles.text}>Adicionar peças há seção</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  secaoItemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  item: {color: '#333', fontSize: 14},
  listSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '3%',
    marginRight: '3%',
    marginBottom: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
  },
  titleSecao: {color: '#333', fontSize: 14, fontWeight: '600'},
  basic: {flexDirection: 'row', justifyContent: 'space-between'},
  container: {
    flex: 1,
    marginBottom: 20,
  },
  containerFormik: {
    padding: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    width: 100,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    color: '#333',
    fontSize: 40,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    flexDirection: 'row',
  },
  textButton: {color: 'red', fontSize: 16, fontWeight: '500', marginLeft: 10},
  text: {fontSize: 16, color: 'red'},
  textMenos: {fontSize: 25, color: 'red', padding: 5},
  textMais: {fontSize: 14, color: 'red', padding: 5},
  editSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menos: {
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  mais: {
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 20,
  },
  adicionar: {
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
});

export default Cadastrar;
