import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik, useFormikContext} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
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
  FlatList,
} from 'react-native';
import validators from '../config/validators';
import {Routes} from './Routes';
import formValidator from '../helpers/formValidator';
import {get, post} from '../services/api';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {StatusBarBlurBackground} from '../views/StatusBarBlurBackground';

import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  SAFE_AREA_PADDING,
} from '../config/Contants';
import {Modalize} from 'react-native-modalize';

type Props = NativeStackScreenProps<Routes, 'Cadastrar'>;

type PropsProduto = {
  id: number;
  descricao: string;
  codigoBarra: number;
  codigoBarraArezzo: number;
  referencia: number;
  corProdutoCodigo: number;
  cor: {
    id: number;
    descricao: string;
    codigo: number;
  };

  valor: number;
};

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
    codigoBarra: validators.codigoBarra,
    codigoBarraArezzo: validators.codigoBarraArezzo,
    corProdutoCodigo: validators.corProdutoCodigo,
    descricao: validators.descricao,
    referencia: validators.referencia,
    valor: validators.valor,
  },
  initialValues: {
    codigoBarra: '',
    codigoBarraArezzo: '',
    corProdutoCodigo: '',
    descricao: '',
    referencia: '',
    valor: '',
  },
});

const Cadastrar = ({navigation}: Props): React.ReactElement => {
  const modalizeRef = useRef<Modalize>(null);
  const modalizeItemRef = useRef<Modalize>(null);

  const numberOfInputs = 6; // Altere conforme necessário
  const inputStates = useAnimatedStates(numberOfInputs);
  const device = useCameraDevice('back');
  const [torch, setTorch] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [produtList, setProdutList] = useState<PropsProduto[]>([]);
  const [produt, setProdut] = useState<PropsProduto>();
  const [isActive, setIsActive] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [buscarCodigoBarra, setBuscarCodigoBarra] = useState('');

  const [valueCodigoBarra, setCodigoBarra] = useState<null | string>(null);

  const postProduto = async (value: {
    codigoBarra: string;
    codigoBarraArezzo: string;
    corProdutoCodigo: string;
    descricao: string;
    referencia: string;
    valor: string;
  }) => {
    try {
      // console.log({value});
      setShowLoading(true);
      setIsActiveModal(false);
      const result = await post<{data: any; message: string}>(
        '/api/v1/cadastrarProduto',
        {
          codigoBarra: +value.codigoBarra,
          codigoBarraArezzo: +value.codigoBarraArezzo,
          corProdutoCodigo: +value.corProdutoCodigo,
          descricao: value.descricao,
          referencia: +value.referencia,
          valor: +value.valor,
        },
      );

      setShowLoading(false);
      Alert.alert('Atenção', result.message, [
        {
          text: 'OK',
          onPress: () => {},
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

  const getProduto = useCallback(async () => {
    try {
      // console.log({value});
      setShowLoading(true);
      const result = await get<{
        data: PropsProduto[];
        message: string;
        lastPage: number;
      }>('/api/v1/listProduto');
      setLastPage(result.lastPage);
      setShowLoading(false);
      setProdutList(result.data);
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

  const onCodeScanned = useCallback((codes: Code[]) => {
    const value = codes[0]?.value;
    if (value == null) {
      return;
    }

    setCodigoBarra(value);
    setIsActive(false);
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['code-128', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  const AutoSubmitToken = ({codigo}: {codigo: string | null}) => {
    // Grab values and submitForm from context
    const {setFieldValue} = useFormikContext();
    React.useEffect(() => {
      // Submit the form imperatively as an effect as soon as form values.token are 6 digits long

      if (codigo) {
        setFieldValue('codigoBarra', codigo);
        setCodigoBarra(null);
      }
    }, [codigo, setFieldValue]);
    return null;
  };

  const handleOnpress = (produto: PropsProduto) => {
    setProdut(produto);
    modalizeItemRef.current?.open();
  };

  const buscaCodigoBarra = useCallback(
    async (codigoBarra: string) => {
      try {
        // console.log({value});
        if (codigoBarra.length < 5) {
          return;
        }
        setShowLoading(true);
        setBuscarCodigoBarra(codigoBarra);
        const result = await get<{
          data: PropsProduto[];
          message: string;
          lastPage: number;
          page: number;
          total: number;
        }>(`/api/v1/listProduto?codigoBarra=${codigoBarra}`);
        setShowLoading(false);
        setProdutList(result.data);
        // setPage(result.lastPage);
      } catch ({response}: any) {
        setShowLoading(false);
        Alert.alert('Atenção', response.data.message, [
          {
            text: 'OK',
            onPress: () => {
              getProduto();
            },
          },
        ]);
      }
    },
    [getProduto],
  );

  const onScrollEndDrag = useCallback(async () => {
    try {
      // console.log({value});
      if (lastPage > page) {
        setShowLoading(true);
        const url = buscarCodigoBarra
          ? `/api/v1/listProdut?page=${
              page + 1
            }&codigoBarra=${buscarCodigoBarra}`
          : `/api/v1/listProdut?page=${page + 1}`;
        const result = await get<{
          data: PropsProduto[];
          message: string;
          lastPage: number;
          page: number;
          total: number;
        }>(url);
        setPage(result.page + 1);
        setShowLoading(false);
        setProdutList(result.data);
      }
    } catch ({response}: any) {
      setShowLoading(false);
      Alert.alert('Atenção', response.data.message, [
        {
          text: 'OK',
          onPress: () => {
            getProduto();
          },
        },
      ]);
    }
  }, [buscarCodigoBarra, getProduto, lastPage, page]);

  useEffect(() => {
    getProduto();
  }, [getProduto]);

  return device != null && isActive ? (
    <View style={styles.containerCamera}>
      {device != null && (
        <Camera
          style={styles.camera}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          enableZoomGesture={true}
        />
      )}

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        <PressableOpacity
          style={styles.buttonTouch}
          onPress={() => setTorch(!torch)}
          disabledOpacity={0.4}>
          <IonIcon
            name={torch ? 'flash' : 'flash-off'}
            color="white"
            size={24}
          />
        </PressableOpacity>
      </View>
      <View style={styles.leftButtonRow}>
        <PressableOpacity
          style={styles.buttonTouch}
          onPress={() => setIsActive(false)}
          disabledOpacity={0.4}>
          <IonIcon name={'close'} color="white" size={24} />
        </PressableOpacity>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        color={'black'}
        size={20}
        onPress={() => navigation.goBack()}
      />
      <TextInput
        style={{
          backgroundColor: 'white',
          marginVertical: 20,
          borderRadius: 10,
          paddingHorizontal: 10,
          color: '#333',
        }}
        placeholder="Busca por codigo de barra"
        placeholderTextColor={'#33333350'}
        onChangeText={value => buscaCodigoBarra(value)}
      />
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.text,
              {fontWeight: '600', fontSize: 15, marginBottom: 10},
            ]}>
            Codigo de Barra
          </Text>
          <Text
            style={[
              styles.text,
              {fontWeight: '400', fontSize: 12, marginBottom: 10},
            ]}>
            Quantidade de produtos cadastrados: {produtList.length}
          </Text>
        </View>

        <FlatList
          extraData={produtList}
          data={produtList}
          style={{height: '75%'}}
          onScrollEndDrag={onScrollEndDrag}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.barCode}
              onPress={() => handleOnpress(item)}>
              <Text style={styles.text}>{item.codigoBarra}</Text>
              <Icon
                name="chevron-right"
                color={'black'}
                size={10}
                style={{marginLeft: 20}}
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => {
            setIsActiveModal(true);
            modalizeRef.current?.open();
          }}
          style={styles.button}>
          <Text style={styles.textButton}>Cadastrar Novo Produto</Text>
        </TouchableOpacity>
      </View>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        onClose={() => console.log('FEchoiu')}>
        <Formik
          validateOnChange={true}
          onSubmit={postProduto}
          validationSchema={validationSchema}
          initialValues={initialValues}
          initialErros={false}>
          {({handleChange, handleSubmit, values, errors}) => (
            <View style={styles.containerFormik}>
              <View style={styles.containerInputs}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AnimatedTextInput
                    key={0}
                    keyboardType={'number-pad'}
                    onChangeText={handleChange('codigoBarra')}
                    value={values.codigoBarra}
                    style={[styles.input, getInputStyle(0)]}
                    onFocus={() => handleInputFocus(0, 1)}
                    onBlur={() => handleInputFocus(0, 0)}
                    placeholder={'Codigo de Barra'}
                    placeholderTextColor={'#333'}
                  />
                  <IconAntDesign
                    style={styles.iconBarcode}
                    onPress={() => setIsActive(true)}
                    name="barcode"
                    color={'black'}
                    size={25}
                  />
                </View>

                {errors.codigoBarra && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.codigoBarra}
                  </Text>
                )}
                <AnimatedTextInput
                  key={1}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('codigoBarraArezzo')}
                  value={values.codigoBarraArezzo}
                  style={[styles.input, getInputStyle(1)]}
                  onFocus={() => handleInputFocus(1, 1)}
                  onBlur={() => handleInputFocus(1, 0)}
                  placeholder={'Codigo de Barra Arezzo'}
                  placeholderTextColor={'#333'}
                />
                {errors.codigoBarraArezzo && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.codigoBarraArezzo}
                  </Text>
                )}
                <AnimatedTextInput
                  key={2}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('corProdutoCodigo')}
                  value={values.corProdutoCodigo}
                  style={[styles.input, getInputStyle(2)]}
                  onFocus={() => handleInputFocus(2, 1)}
                  onBlur={() => handleInputFocus(2, 0)}
                  placeholder={'Codigo da cor do Produto'}
                  placeholderTextColor={'#333'}
                />
                {errors.corProdutoCodigo && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.corProdutoCodigo}
                  </Text>
                )}
                <AnimatedTextInput
                  key={4}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('referencia')}
                  value={values.referencia}
                  style={[styles.input, getInputStyle(4)]}
                  onFocus={() => handleInputFocus(4, 1)}
                  onBlur={() => handleInputFocus(4, 0)}
                  placeholder={'Referencia do Produto'}
                  placeholderTextColor={'#333'}
                />
                {errors.referencia && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.referencia}
                  </Text>
                )}
                <AnimatedTextInput
                  key={3}
                  onChangeText={handleChange('descricao')}
                  style={[styles.input, getInputStyle(3)]}
                  value={values.descricao}
                  onFocus={() => handleInputFocus(3, 1)}
                  onBlur={() => handleInputFocus(3, 0)}
                  placeholder={'Descrição do Produto'}
                  placeholderTextColor={'#333'}
                />
                {errors.descricao && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.descricao}
                  </Text>
                )}

                <AnimatedTextInput
                  key={5}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('valor')}
                  value={values.valor}
                  style={[styles.input, getInputStyle(5)]}
                  onFocus={() => handleInputFocus(5, 1)}
                  onBlur={() => {
                    handleInputFocus(5, 0);
                  }}
                  placeholder={'Valor do Produto'}
                  placeholderTextColor={'#333'}
                />
                {errors.valor && (
                  <Text style={styles.erro} allowFontScaling={false}>
                    {errors.valor}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.button}>
                <View
                  style={{
                    flexDirection: 'row',
                    opacity: showLoading ? 0.3 : 1,
                  }}>
                  <IconAntDesign name="plus" color={'red'} size={25} />
                  <Text style={styles.textButton}>Cadastrar Novo Produto</Text>
                </View>
                <ActivityIndicator
                  animating={showLoading}
                  style={{position: 'absolute'}}
                  color="red"
                  size="large"
                />
              </TouchableOpacity>
              <AutoSubmitToken codigo={valueCodigoBarra} />
            </View>
          )}
        </Formik>
      </Modalize>
      <Modalize ref={modalizeItemRef} adjustToContentHeight={true}>
        <View style={styles.containerModal}>
          <Text style={styles.titleModal}>{produt?.descricao}</Text>
          <Text style={styles.barCodeModal}>
            <Text style={styles.textInfo}>Codigo de Barra: </Text>
            {produt?.codigoBarra} <Text style={styles.textInfo}>Ref: </Text>
            {produt?.referencia}
          </Text>
          <View style={styles.infoModal}>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>Cor:</Text> {produt?.cor.descricao}{' '}
              /{' '}
            </Text>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>Cod:</Text> {produt?.cor.codigo}
            </Text>
          </View>
          <Text style={styles.textModal}>
            <Text style={styles.textInfo}>Valor da peça: </Text>R${' '}
            {produt?.valor}
          </Text>
          <Text style={styles.textModal}>
            <Text style={styles.textInfo}>Valor da peça: </Text>R${' '}
            {produt?.valor}
          </Text>
        </View>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  barCodeModal: {color: '#333', fontSize: 14, textAlign: 'center'},
  textModal: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  textInfo: {fontWeight: '500', fontSize: 15},
  infoModal: {flexDirection: 'row', marginTop: 10},
  titleModal: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  containerModal: {padding: 20},
  containerCamera: {
    flex: 1,
    backgroundColor: 'black',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  leftButtonRow: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  buttonTouch: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    height: '20%',
    width: '90%',
    alignSelf: 'center',
    marginTop: '20%',
  },
  iconBarcode: {
    marginTop: 10,
    marginLeft: 20,
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
    height: 50,
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
  },
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
  textButton: {color: 'red', fontSize: 16, fontWeight: '500', marginLeft: 10},
});

export default Cadastrar;
