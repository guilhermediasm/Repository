import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {post} from '../services/api';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  SAFE_AREA_PADDING,
} from '../config/Contants';
import {useIsForeground} from '../hooks/useIsForeground';
import {StatusBarBlurBackground} from '../views/StatusBarBlurBackground';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {Routes} from './Routes';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/core';

type Secao = {CodigoBarra: number; NumeroSecao: number; Quantidade: number}[];
type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>;
const CodeScannerPage = ({navigation, route}: Props): React.ReactElement => {
  // 1. Use a simple default back camera
  const device = useCameraDevice('back');

  const secao = route.params.secao;

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);
  const [secaoList, setSecaoList] = useState<Secao>([]);
  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false);
  const onCodeScanned = useCallback((codes: Code[]) => {
    if (isShowingAlert.current) {
      return;
    }

    const value = codes[0]?.value;
    if (value == null) {
      return;
    }

    isShowingAlert.current = true;
    postProduto(value);
  }, []);

  const postProduto = async (code: string) => {
    try {
      // console.log({value});
      const result = await post<{
        data: Secao;
        message: string;
      }>('/api/v1/cadastrarSecao', {
        NumeroSecao: secao,
        CodigoBarra: +code,
      });

      setSecaoList(result.data);

      Alert.alert('Atenção', result.message, [
        {
          text: 'Trocar seção',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: 'Continuar',
          onPress: () => {
            isShowingAlert.current = false;
          },
        },
      ]);
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
  };

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['code-128', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  return (
    <View style={styles.container}>
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
          style={styles.button}
          onPress={() => setTorch(!torch)}
          disabledOpacity={0.4}>
          <IonIcon
            name={torch ? 'flash' : 'flash-off'}
            color="white"
            size={24}
          />
        </PressableOpacity>
      </View>

      {/* Back Button */}
      <PressableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <IonIcon name="chevron-back" color="white" size={35} />
      </PressableOpacity>

      <View style={styles.list}>
        <Text style={{color: 'white'}}>Número da Seção: {secao}</Text>
        <View style={styles.barCodeTitle}>
          <View>
            <Text>Barcode</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text>Quantidade</Text>
          </View>
        </View>
        {secaoList.map((item, index) => (
          <View key={index.toString()} style={styles.barCode}>
            <View>
              <Text>{item.CodigoBarra}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text>{item.Quantidade}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.finalizar}
        onPress={() => navigation.goBack()}>
        <Text style={{color: 'red'}}>Finalizar Seção</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CodeScannerPage;

const styles = StyleSheet.create({
  list: {marginTop: '20%', marginHorizontal: 20},
  barCodeTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  barCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  camera: {
    height: '20%',
    width: '90%',
    alignSelf: 'center',
    marginTop: '20%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  finalizar: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    padding: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
