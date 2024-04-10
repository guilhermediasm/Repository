import * as React from 'react';
import {useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Modalize} from 'react-native-modalize';
import {get} from '../services/api';
import type {Routes} from './Routes';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type Secao = {CodigoBarra: number; NumeroSecao: number; Quantidade: number}[];
type Produto = {
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
  secao: {
    NumeroSecao: number;
    CodigoBarra: number;
    Quantidade: number;
  };
  valor: number;
};
type Props = NativeStackScreenProps<Routes, 'SecaoPage'>;
const SecaoPage = ({navigation, route}: Props): React.ReactElement => {
  const secao = route.params.secao;
  const modalizeRef = useRef<Modalize>(null);

  const [secaoList, setSecaoList] = useState<Secao>([]);
  const [itemSelected, setItemSelected] = useState<Produto | null>(null);
  const [showLoadingProduto, setShowLoadingProduto] = useState(false);

  const isShowingAlert = useRef(false);

  const getListSecao = React.useCallback(async () => {
    try {
      // console.log({value});
      const result = await get<{
        data: Secao;
        message: string;
      }>(`/api/v1/showSecao?secao=${secao}`);

      setSecaoList(result.data);
    } catch ({response}: any) {
      Alert.alert('Atenção', response.data.message, [
        {text: 'Trocar seção', onPress: () => {}},
        {
          text: 'Continuar',
          onPress: () => {
            isShowingAlert.current = false;
          },
        },
      ]);
    }
  }, [secao]);

  const handleCode = async (CodigoBarra: number) => {
    try {
      modalizeRef.current?.open();
      setShowLoadingProduto(true);
      const result = await get<{
        data: Produto;
        message: string;
      }>(`/api/v1/showProduto?codigoBarra=${CodigoBarra}`);

      setItemSelected(result.data);
    } catch ({response}: any) {
      Alert.alert('Atenção', response.data.message, [
        {text: 'Trocar seção', onPress: () => {}},
        {
          text: 'Continuar',
          onPress: () => {
            isShowingAlert.current = false;
          },
        },
      ]);
    } finally {
      setShowLoadingProduto(false);
    }
  };

  React.useEffect(() => {
    getListSecao();
  }, [getListSecao]);

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <Text style={{color: 'black', marginBottom: 20, fontSize: 25}}>
          Seção: {secao}
        </Text>
        <View style={styles.barCodeTitle}>
          <Text style={styles.textTitle}>Barcode</Text>

          <Text style={styles.textTitle}>Quantidade</Text>
        </View>
        {secaoList.map((item, index) => (
          <TouchableOpacity
            onPress={() => handleCode(item.CodigoBarra)}
            key={index.toString()}
            style={styles.barCode}>
            <Text style={styles.text}>{item.CodigoBarra}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>{item.Quantidade}</Text>
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
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.finalizar}
          onPress={() => navigation.goBack()}>
          <Text style={{color: 'red'}}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        {showLoadingProduto && (
          <Text style={{color: '#333', fontSize: 20}}>Caregando...</Text>
        )}
        {!showLoadingProduto && (
          <View style={styles.containerModal}>
            <Text style={styles.titleModal}>{itemSelected?.descricao}</Text>
            <Text style={styles.barCodeModal}>
              <Text style={styles.textInfo}>Codigo de Barra: </Text>
              {itemSelected?.codigoBarra}{' '}
              <Text style={styles.textInfo}>Ref: </Text>
              {itemSelected?.referencia}
            </Text>
            <View style={styles.infoModal}>
              <Text style={styles.textModal}>
                <Text style={styles.textInfo}>Cor:</Text>{' '}
                {itemSelected?.cor.descricao} /{' '}
              </Text>
              <Text style={styles.textModal}>
                <Text style={styles.textInfo}>Cod:</Text>{' '}
                {itemSelected?.cor.codigo}
              </Text>
            </View>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>Valor da peça: </Text>R${' '}
              {itemSelected?.valor}
            </Text>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>Valor da peça: </Text>R${' '}
              {itemSelected?.valor}
            </Text>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>
                Quantidade de peças na seção:{' '}
              </Text>
              {itemSelected?.secao.Quantidade}
            </Text>
            <Text style={styles.textModal}>
              <Text style={styles.textInfo}>Valor total: R$ </Text>
              {itemSelected?.secao.Quantidade && itemSelected?.valor
                ? itemSelected?.secao.Quantidade * itemSelected?.valor
                : '0,00'}
            </Text>
          </View>
        )}
      </Modalize>
    </View>
  );
};

export default SecaoPage;

const styles = StyleSheet.create({
  textInfo: {fontWeight: '500', fontSize: 15},
  textModal: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  containerModal: {padding: 20},
  infoModal: {flexDirection: 'row', marginTop: 10},
  barCodeModal: {color: '#333', fontSize: 14, textAlign: 'center'},
  titleModal: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  textTitle: {fontWeight: '600', color: 'black', fontSize: 14},
  text: {color: 'black'},
  list: {marginTop: 20, marginHorizontal: 20},
  barCodeTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  finalizar: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'red',
    paddingVertical: 20,
    alignItems: 'center',
    width: '40%',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
