
import { StyleSheet } from 'react-native'

const base = {
  backgroundImage: {
    flex: 1,
    backgroundColor: '#222222'
  },
  backgroundCentered: {
    flex: 1,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInputBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    marginBottom: 5
  },
  textInput: {
    height: 30,
    backgroundColor: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  headingLarge: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(25, 25, 25, 0.75)',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 2 },
    height: 50,
    lineHeight: 40
  },
  headingMedium: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    height: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 2 }
  },
  whiteText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 1,
    textShadowOffset: { width: 0, height: 1 }
  },
  whileTextLink: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 250,
    fontWeight: 'bold',
    textShadowColor: 'rgba(50, 50, 50, 0.5)',
    textShadowRadius: 1,
    textShadowOffset: { width: 0, height: 1.25 }
  },
  buttonBar: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pillBox: {
    height: 135,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

const styles = StyleSheet.create(base)

export default styles
