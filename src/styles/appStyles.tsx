import {ImageBackground} from 'react-native';
import {Positions} from 'react-native-calendars/src/expandableCalendar';
import {getRightStyles} from 'react-native-paper/lib/typescript/components/List/utils';
import {ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {panHandlerName} from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';
import {ResizeMode} from 'react-native-video';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// appStyles.js

interface AppStyles {
  header: TextStyle;
  headerText: TextStyle;
  primaryBtn: TextStyle;
  text: TextStyle;
  Btn: TextStyle;
  bottomBorder: TextStyle;
  timerText: TextStyle;
  footer: TextStyle;
  menu: TextStyle;
  menuItem: TextStyle;
  scrollView: TextStyle;
  circleBtn: TextStyle;
  savingAccCard: TextStyle;
  imguploadBtn: TextStyle;
  secondaryBtn: TextStyle;
  panCard: TextStyle;
  aadharCard: TextStyle;
  activeText: TextStyle;
  cartabsBtn: TextStyle;
  activeBtn: TextStyle;
  icon: TextStyle;
  profileimg: TextStyle;
  uploadProfile: TextStyle;
  tabContentContainer: TextStyle;
  activeTabContainerText: TextStyle;
  tabContainerText: TextStyle;
  activetabContainerItem: TextStyle;
  tabContainerItem: TextStyle;
  tabContainer: TextStyle;
  textIcon: TextStyle;
  closebutton: ViewStyle;
  button: TextStyle;
  iconimage: TextStyle;
  activeTabText: TextStyle;
  tabText: TextStyle;
  activeTabItem: TextStyle;
  tabItem: TextStyle;
  customTab: TextStyle;
  customTabContant: TextStyle;
  label: TextStyle;
  radioButtonContainer: TextStyle;
  innerContent: TextStyle;
  nestedScrollView: TextStyle;
  disabledBtn: TextStyle;
  optional: TextStyle;
  signUpOption: TextStyle;
  signupText:TextStyle;
  signupLink:TextStyle;
  redirectingSignup:TextStyle;
  externalLinkContainer:TextStyle;
  externalLinkTitleContainer:TextStyle;
  fireSideImage:ImageStyle;
  externalLinkTitle:TextStyle;
  externalLinkButtonContainer:TextStyle;
  liveresultouterwrapper:TextStyle;
  liveresultcontainer:TextStyle;
  callBtn:TextStyle;
  callBtnIcon:TextStyle;
  modalContent:TextStyle;
  jodiscontainer:ViewStyle;
  btn:ViewStyle;
  forgotLink:ViewStyle;
  // logoImage:ImageStyle;

  // game post ------------
  innerHeader: ViewStyle;
  backButton: ViewStyle;
  backText: TextStyle;
  headerTitle: TextStyle;
  logo: ImageStyle;
  mainContainer: ViewStyle;
  scrollContent: ViewStyle;
  pinnedChat: ViewStyle;
  boxPinnedInner: ViewStyle;
  boxInnerContainer: ViewStyle;
  pinnedMessageHeader: ViewStyle;
  postHost: ViewStyle;
  pinnedByText: TextStyle;
  postByText: TextStyle;
  dateTimeContainer: ViewStyle;
  dateText: TextStyle;
  timeText: TextStyle;
  boxses: ViewStyle;
  boxInner: ViewStyle;
  boxInnerWrapper: ViewStyle;
  messageHeader: ViewStyle;
  postContainer: ViewStyle;
  postHostText: TextStyle;
  nameText: TextStyle;
  boxRightArea: ViewStyle;
  marketNameText: TextStyle;
  marketText: TextStyle;
  tricksInfoContainer: ViewStyle;
  tricksFromText: TextStyle;
  boldText: TextStyle;
  dateContainer: ViewStyle;
  emojiReactions: ViewStyle;
  reactionBtn: ViewStyle;
  emojiText: TextStyle;
  emojiCount: TextStyle;
  messageTricks: ViewStyle;
  trickText: TextStyle;
  valuesContainer: ViewStyle;
  valueRow: ViewStyle;
  valueLabel: TextStyle;
  emojiWrapper: ViewStyle;
  predefinedEmojis: ViewStyle;
  emojiBtn: ViewStyle;
  emojiPickerIcon: ViewStyle;
  dateTimeFooter: ViewStyle;
  replyButton: ViewStyle;
  replyText: TextStyle;
  replyOptionsContainer: ViewStyle;
  replyOption: ViewStyle;
  replyOptionText: TextStyle;
  replyCount: TextStyle;
  noDataContainer: ViewStyle;
  noDataText: TextStyle;
  addPostButton: ViewStyle;
  addPostText: TextStyle;
}

const appStyles: AppStyles = {
  jodiscontainer:{
    height:"100%",
    width:"100%"
  },
  panCard:{
    width:300
  },
  externalLinkContainer:{
    backgroundColor: 'lightgreen', 
    padding: 20,
  },
  externalLinkTitleContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  fireSideImage:{
    marginRight: 5
  },
  externalLinkTitle:{
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  externalLinkButtonContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveresultouterwrapper:{
    backgroundColor: '#123524',
    padding: 20,
    borderBottomWidth: 18,
    borderColor: 'white',
  },
  liveresultcontainer:{
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#E1EFE6',
    // textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#ffffff',
    zIndex: 1,
    elevation: 4,
  },

  backgroundImage: {
    flex: 1,
    ResizeMode: 'cover',
    justifyContent: 'center',
  },

  // backgroundImage:{
  //      flex:1,
  //      ResizeMode:'cover',
  //      justifyContent:'center',
  // },


  // backgroundImage: {
  //   flex: 1,
  //   resizeMode: 'cover',
  //   justifyContent: 'center',
  // },
  
  welcomeText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: '#30EF17',
    top: 40,
  },
  blurContainer: {
    alignSelf: 'center',
    width: '90%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden', // To keep BlurView within rounded corners
    marginTop: 170,
    // width: '100%',
    height: '60%',
  },
  blurView: {
    padding: 20,
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 50,
    width: '100%',
    height: '100%',
    // backgroundColor:'#EEFFD6'
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: 130,
    position: 'relative',
  },
  countryCode: {
    position: 'absolute',
    left: 10,
    top: 104,
    zIndex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  // formInput: {
  //   height: 50,
  //   width:'90%',
  //   borderWidth: 1,
  //   borderColor: 'green',
  //   borderRadius: 10,
  //   backgroundColor: '#ffffff',
  //   color: '#000000',
  //   fontSize: 16,
  //   paddingLeft: 20,
  //   textAlignVertical: 'center',
  //   position:'absolute',
  //   top:90,
  //   marginBottom:10,
  //   left:20,

  optional: {
    position: 'absolute',
    right: 60,
    top: 80,
    color: '#999',
  },
  sendOtpButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 80,
    width: '90%',
    left: 20,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },

  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  Btn: {
    position: 'relative',
  },
  primaryBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#4CB050',
    borderRadius: 40,
    color: 'white',
    fontWeight: '500',
    minWidth: 100,

  },
  secondaryBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#DE7A2D',
    borderRadius: 40,
    color: 'white',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  // bottomBorder: {
  //   position: 'absolute',
  //   bottom: -5,
  //   left: 0,
  //   right: 0,
  //   height: 40,
  //   backgroundColor: '#000000',
  //   borderRadius: 40,
  //   width:'70%',
  //   top:270,
  //   left:40
  
  // },
  callBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#1E4620',
    borderRadius: 40,
    color: 'white',
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    paddingLeft: 45,
    paddingRight: 10,
  },

  stopBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#1E4620',
    borderRadius: 40,
    color: 'white',
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    paddingLeft: 45,
    paddingRight: 10,
  },
  callBtnIcon: {
    position: 'absolute',
    width: 45,
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    left: -5,
    top: -5,
    minHeight: 45,
    minWidth: 45,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green',
    textAlign: 'center',
  },
  backgroundImage: {
    resizeMode: 'cover', // or 'stretch' or 'contain'
    height: 220,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contentText: {
    flex: 1,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconLogo: {
    width: 40,
    height: 40,
  },
  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  iconimage: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },

  activeText: {
    color: '#ffffff',
    backgroundColor: '#4CB050',
  },
  imguploadBtn: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  otpInput: {
    width: '17%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    textAlign: 'center',
    fontSize: 24,
    color: '#747474',
  },
  cartabsBtn: {
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#E1EFE6',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: '48%',
    fontWeight: '500',
  },
  textIcon: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tagBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 10,
  },
  // eslint-disable-next-line no-dupe-keys
  label: {
    marginLeft: 4, // Add spacing between the radio button and the label
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tabContentContainer: {
    padding: 15,
  },
  tabContainerItem: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  activetabContainerItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CB050',
  },
  tabContainerText: {
    color: '#000000',
  },
  activeTabContainerText: {
    color: '#4CB050',
  },
  closebutton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
  customTab: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomColor: '#ffffff',
    backgroundColor: '#e1efe6',
    color: '#ffffff',
  },
  customTabContant: {
    paddingTop: 20,
  },
  tabItem: {
    flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 4,
    // borderRightWidth: 2,
    padding:10,
    borderBottomColor: '#4CB050',
    borderRightColor: '#4CB050',
  },
  tabText: {
    color: '#000000',
  },
  activeTabText: {
    color: '#004225',
    // fontSize: 18,
    // color:'black'
  },
  chatFix: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    right: 20,
  },
  logoimageCenter: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    logoimageCenter: 'center',  
  },
  logoImageWrapper:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // logoImage:{
  //   height: 70, 
  //   width: 70,
  // },
  outlineBtn: {
    textAlign: 'center',
    padding: 8,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },

  formOutline: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderColor: '#cccccc',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
    minWidth: 45,
  },

  messagesContainer: {
    flex: 1,
    marginBottom: 8,
  },

  message: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  user1MessageContainer: {
    flexDirection: 'row-reverse', // Align user1 messages to the right
  },
  user2MessageContainer: {
    flexDirection: 'row', // Align user2 messages to the left
  },
  messageContent: {
    maxWidth: '80%', // Limit message width to 80% of the container
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  user1MessageContent: {
    backgroundColor: '#555', // User 1 message background color
    borderTopRightRadius: 0, // Adjust border radius for user1 messages
    color: '#fff',
  },
  user2MessageContent: {
    backgroundColor: '#4CB050', // User 2 message background color
    borderTopLeftRadius: 0, // Adjust border radius for user2 messages
  },
  messageText: {
    fontSize: 15, // Set the default font size for message text
  },
  user1MessageText: {
    color: '#fff', // Set text color to black for user1 messages
  },
  user2MessageText: {
    color: '#fff', // Set text color to white for user2 messages
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    paddingTop: 5,
  },
  user1TimeText: {
    color: '#ddd', // Set text color to black for user1 messages
  },
  user2TimeText: {
    color: '#ddd', // Set text color to white for user2 messages
    alignSelf: 'flex-start',
  },
  // ... (other styles remain the same)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', 
    elevation: 4,
  },
  input: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'darkgreen',
    paddingRight: 72,
    borderRadius: 20,
  },
  sendButton: {
    position: 'absolute', // Position the button absolutely
    right: 100, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  recordingButton: {
    position: 'absolute', // Position the button absolutely
    right: 55, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  fileButton: {
    position: 'absolute', // Position the button absolutely
    right: 5, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  formInput: {
    backgroundColor: '#ECECEC',
    padding: 15,
    borderWidth:1,
    borderRadius:20

  },

  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 10, // Adjust the padding to center the icon vertically
  },
  uploadProfile: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative', // Added position relative to allow absolute positioning of the icon
  },
  profileimg: {
    width: '100%',
    height: '100%',
  },

  icon: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#00000040',
    left: 0,
    right: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 6,
  },
  additionalStyle: {
    paddingLeft: 80,
  },
  timerText: {
    paddingLeft: 15,
    marginLeft: 10,
  },
  footer: {
    position: 'relative',
    backgroundColor: '#4CB050',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    color: '#ffffff',
    zIndex: 1,
    elevation: 5,
  },
  table: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  tableflex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  flexcell: {
    width: '20%',
    flex: 0,
  },

  flexcell5: {
    width: '16%',
    flex: 0,
  },

  cell: {
    flex: 1,
    textAlign: 'center',
    borderColor: 'green',
    borderWidth: 1,
    marginHorizontal: 4,
    marginBottom: 10,
  },

  inputNo: {
    height: 37,
    width: '100%',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
    textAlign: 'center',
  },

  nestedScrollView: {
    maxHeight: 800, // Example height, adjust as needed
  },
  innerContent: {
    // Styles for inner content
  },
  footerFix: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    display: 'flex',

    justifyContent: 'space-between',
  },
  headerCell: {
    textAlign: 'center',
    color: '#000000',
    borderWidth: 1,
    padding: 10,
    borderColor: '#cccccc',
    fontSize: 15,
  },
  innerRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  innerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems:"center",
    // padding: 3,
    margin: 0,
    textAlign: 'center',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#cccccc',
  },

  // innermanualCell: {
  //   padding: 12,
  // },

  inputData: {
    height: 40,
    width: '100%',
    textAlign: 'center',
  },

  inputmanual: {
    // width: '100%',
    textAlign: 'center',
    margin:0,
  },

  // BY Umang

  disabledBtn: {
    opacity: 0.75,
  },

  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },

  // optional: {
  //   position: 'absolute',
  //   top: 20,
  //   bottom: 0,
  //   right: 10,
  // },

  // modal for submit kyc
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  // button: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginHorizontal: 10,
  //   alignItems: 'center',
  // },
  cancelButton: {
    backgroundColor: '#f44336', // Red
  },
  submitButton: {
    backgroundColor: '#4CAF50', // Green
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    // backgroundColor: '#000000',
  },
  // button: {
  //   padding: 10,
  //   backgroundColor: "#007bff",
  //   borderRadius: 5,
  // },
  disabled: {
    backgroundColor: '#cccccc',
  },
  // buttonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   textAlign: "center",
  // },
  disabledText: {
    color: '#666666',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
  },


  // ------------------- login ---------
  alreadyLoginView:{
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    color:"black",
    width:"50%"
  },
  signUpOption:{
   
    color:"black",
    width:"100%",
    textAlign:"center",
    fontWeight: "600"
  },
  redirectingSignup:{
    width:"100%",
    color:"black",
    justifyContent: 'center',
    alignItems:"center",
    paddingTop: 10
  },
  signupText: {
    fontSize: 14,
    color: "black",
  },
  signupLink: {
    color: "black",
    fontWeight: '600',
  },
  forgotLink:{
    paddingTop: 10,
    paddingBottom: 10,
    color:"black",
  },


  // game post -------------

  innerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 4,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  logo: {
    width: 55,
    height: 55,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
  },
  pinnedChat: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 8,
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  boxPinnedInner: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  boxInnerContainer: {
    flex: 1,
    marginLeft: 8,
  },
  pinnedMessageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  postHost: {
    flex: 1,
  },
  pinnedByText: {
    fontSize: 12,
    color: "#333",
  },
  postByText: {
    fontSize: 12,
    color: "#333",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  boxses: {
    marginBottom: 24,
    width: "100%",
  },
  boxInner: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: "90%",
  },
  boxInnerWrapper: {
    width: "100%",
  },
  messageHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    flexWrap: "wrap",
    // marginBottom: 8,
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // marginRight: 8,
  },
  postHostText: {
    fontSize: 12,
    color: "#737373",
    marginRight: 4,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  boxRightArea: {
    // flex: 1,
  },
  marketNameText: {
    fontWeight: "bold",
    // marginBottom: 8,
  },
  marketText: {
    color: "green",
  },
  tricksInfoContainer: {
    marginVertical: 8,
  },
  tricksFromText: {
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emojiReactions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  emojiText: {
    fontSize: 16,
  },
  emojiCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  messageTricks: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  trickText: {
    textAlign: "right",
    marginBottom: 4,
  },
  valuesContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  valueRow: {
    marginBottom: 4,
  },
  valueLabel: {
    fontWeight: "bold",
    width: 80,
    textAlign: "center",
  },
  emojiWrapper: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  predefinedEmojis: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiBtn: {
    marginRight: 8,
  },
  emojiPickerIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  dateTimeFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  replyButton: {
    marginTop: 4,
  },
  replyText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  replyOptionsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  replyOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  replyOptionText: {
    fontWeight: "bold",
    marginRight: 8,
  },
  replyCount: {
    fontSize: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
  },
  addPostButton: {
    alignSelf: "center",
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  addPostText: {
    color: "white",
    fontWeight: "500",
  },
};

export default appStyles;
