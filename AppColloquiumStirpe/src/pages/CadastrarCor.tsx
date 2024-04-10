import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import validatorCor from '../config/validatorsCor';
import {Routes} from './Routes';
import formValidator from '../helpers/formValidator';
import {get, post} from '../services/api';
import {Modalize} from 'react-native-modalize';

type Props = NativeStackScreenProps<Routes, 'CadastrarCor'>;
type ResponseCor = {
  id: number;
  descricao: string;
  codigo: number;
}[];

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const useAnimatedStates = (numberOfItems: number) => {
  const animations: Animated.Value[] = Array.from(
    {length: numberOfItems},
    () => new Animated.Value(0),
  );
  return animations;
};

const {initialValues, validationSchema} = formValidator({
  validationShape: {
    codigo: validatorCor.codigo,
    descricao: validatorCor.descricao,
  },
  initialValues: {
    codigo: '',
    descricao: '',
  },
});

const Cadastrar = ({navigation}: Props): React.ReactElement => {
  const modalizeRef = useRef<Modalize>(null);

  const numberOfInputs = 2; // Altere conforme necessário
  const inputStates = useAnimatedStates(numberOfInputs);
  const [showLoading, setShowLoading] = useState(false);
  const [corList, setCorList] = useState<ResponseCor>([]);

  const getCor = useCallback(async () => {
    try {
      setShowLoading(true);
      const response = await get<{data: ResponseCor}>('/api/v1/showCor');
      setShowLoading(false);
      setCorList(response.data);
    } catch ({response}: any) {
      setShowLoading(false);
    }
  }, []);

  const postProduto = async (value: {codigo: string; descricao: string}) => {
    try {
      setShowLoading(true);
      await post<{data: any}>('/api/v1/cadastrarCor', {
        codigo: +value.codigo,
        descricao: value.descricao,
      });
      setShowLoading(false);
      Alert.alert('Atenção', 'Cor cadastrada com sucesso', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch ({response}: any) {
      setShowLoading(false);
      Alert.alert('Atenção', response.data.message, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  };

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
        outputRange: ['#ddd', '#ff5e57'],
      }),
      color: '#333',
      fontSize: inputStates[index].interpolate({
        inputRange: [0, 1],
        outputRange: [16, 20],
      }),
    };
  };

  useEffect(() => {
    getCor();
  }, [getCor]);

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        color={'black'}
        size={20}
        style={{margin: 20}}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1, padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginBottom: 10,
          }}>
          <Text style={{color: '#333', fontWeight: '600', fontSize: 16}}>
            Descrição
          </Text>

          <Text style={{color: '#333', fontWeight: '600', fontSize: 16}}>
            Código
          </Text>
        </View>
        {corList.map((item, index) => (
          <View key={index.toString()} style={styles.barCode}>
            <Text style={styles.text}>{item.descricao}</Text>

            <Text style={styles.text}>{item.codigo}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => modalizeRef.current?.open()}
        style={[styles.button, {marginHorizontal: 20, marginBottom: 20}]}>
        <View
          style={{
            flexDirection: 'row',
            opacity: showLoading ? 0.3 : 1,
          }}>
          <IconAntDesign name="plus" color={'red'} size={25} />
          <Text style={styles.textButton}>Adicionar Nova Cor</Text>
        </View>

        <ActivityIndicator
          animating={showLoading}
          style={{position: 'absolute'}}
          color="red"
          size="large"
        />
      </TouchableOpacity>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <Formik
          onSubmit={postProduto}
          validationSchema={validationSchema}
          initialValues={initialValues}
          initialErros={false}>
          {({handleChange, handleSubmit, values, errors}) => (
            <View style={styles.containerFormik}>
              <View style={styles.containerInputs}>
                <AnimatedTextInput
                  key={0}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('codigo')}
                  value={values.codigo}
                  style={[styles.input, getInputStyle(0)]}
                  onFocus={() => handleInputFocus(0, 1)}
                  onBlur={() => handleInputFocus(0, 0)}
                  placeholder={'Codigo da Cor'}
                  placeholderTextColor={'#333'}
                />
                {errors.codigo && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.codigo}
                  </Text>
                )}
                <AnimatedTextInput
                  key={1}
                  onChangeText={handleChange('descricao')}
                  value={values.descricao}
                  style={[styles.input, getInputStyle(1)]}
                  onFocus={() => handleInputFocus(1, 1)}
                  onBlur={() => handleInputFocus(1, 0)}
                  placeholder={'Descrição da Cor'}
                  placeholderTextColor={'#333'}
                />
                {errors.descricao && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.descricao}
                  </Text>
                )}
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={styles.button}>
                  <View
                    style={{
                      flexDirection: 'row',
                      opacity: showLoading ? 0.3 : 1,
                    }}>
                    <IconAntDesign name="plus" color={'red'} size={25} />
                    <Text style={styles.textButton}>Adicionar</Text>
                  </View>

                  <ActivityIndicator
                    animating={showLoading}
                    style={{position: 'absolute'}}
                    color="red"
                    size="large"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => modalizeRef.current?.close()}
                  style={styles.button}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      opacity: showLoading ? 0.3 : 1,
                    }}>
                    <Text style={styles.textButton}>Fechar</Text>
                    <ActivityIndicator
                      animating={showLoading}
                      style={{position: 'absolute'}}
                      color="red"
                      size="large"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerFormik: {
    padding: 20,
    marginTop: 20,
  },
  containerInputs: {
    marginBottom: 20,
  },
  erro: {
    color: 'red',
  },
  input: {
    height: 40,
    width: 250,
    borderBottomWidth: 2,
    marginVertical: 10,
    color: '#333',
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
    minWidth: '40%',
  },
  textButton: {color: 'red', fontSize: 16, fontWeight: '500', marginLeft: 10},
  barCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
  },
  text: {color: 'black'},
});

export default Cadastrar;
