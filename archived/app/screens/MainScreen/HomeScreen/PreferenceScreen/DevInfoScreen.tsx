import * as Clipboard from "expo-clipboard";
import { useAssets } from "expo-asset";
import { useToast } from "native-base";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RoundedButton from "../../../../components/buttons/RoundedButton";
import MenuModal, {
  MenuModalItem,
} from "../../../../components/modals/MenuModal";
import { bColors, bFont, bSpace } from "../../../../styles/base";
import screens from "../../../../styles/screens";

/**
 * 개발자 정보 화면
 * TBD 실제 서비스의 프로필 화면을 변형해서 만들기
 *     실제 서비스 프로필 화면에 쓰이는 데이터를 가지고 만들기
 * @returns
 */
export function DevInfoScreen() {
  /** 어플리케이션 로고 asset 붙여놓기 */
  const [assets, error] = useAssets([
    require("../../../../assets/dev/profile.jpg"),
    require("../../../../assets/dev/graph.png"),
    require("../../../../assets/socials/github-small.png"),
    require("../../../../assets/dev/sylye.jpg"),
  ]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [myMailAddr, _] = useState<string>("anteater1056@gmail.com");

  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);

  const toast = useToast();

  return (
    <ScrollView style={screens.defaultScreenLayout}>
      <MenuModal
        visible={menuModalVisible}
        setModalVisible={setMenuModalVisible}
      >
        <MenuModalItem menuText="노래 부르는 것도" onMenuPress={() => {}} />
        <MenuModalItem menuText="좋아하는 편입니다." onMenuPress={() => {}} />
        <MenuModalItem menuText="그리고 여긴" onMenuPress={() => {}} />
        <MenuModalItem
          menuText="여러 기능들이 포함될 예정입니다."
          onMenuPress={() => {
            alert("눌러도 별 거 없어요..");
          }}
        />
      </MenuModal>
      <View style={style.rootContainer}>
        <View
          onTouchEnd={() => {
            toast.show({
              description: "죄송하지만 준비한 페이지가 하나밖에 없어요.",
            });
          }}
          style={style.menuContainer}
        >
          <Text style={[style.menuText, style.menuTextSelected]}>홈</Text>
          <Text style={style.menuText}>영상</Text>
          <Text style={style.menuText}>리액션</Text>
          <Text style={style.menuText}>게시판</Text>
        </View>
        <View style={style.profileContainer}>
          <View style={style.profilePictureContainer}>
            {assets ? (
              <Image
                style={style.profilePicture}
                source={assets[0] as ImageSourcePropType}
              />
            ) : null}
            <View style={style.profileLevelIconContainer}>
              <View style={style.profileLevelIconDeco} />
              <Pressable
                onPress={() => {
                  toast.show({
                    description: "이거는 그.. 레벨 같은 겁니다.",
                  });
                }}
              >
                <Text selectable={false} style={style.profileLevelIcon}>
                  🔰
                </Text>
              </Pressable>
              <View style={style.profileLevelIconDeco} />
            </View>
          </View>
          <View style={style.profileTextContainer}>
            <View style={style.introductionContainer}>
              <Text style={style.myName}>이지훈</Text>
              <Text style={style.myNickname}>@anteater333</Text>
              <Text numberOfLines={2} style={style.myComment}>
                안녕하세요. 개발잡니다. 이것저것 만드는걸 좋아합니다.
              </Text>
            </View>
            <View style={style.followContainer}>
              <View style={style.followTextContainer}>
                <Text style={style.followTextTop}>팔로워</Text>
                <Text style={style.followTextBottom}>(아주 적음)</Text>
              </View>
              <View style={style.verticalSeparator} />
              <View style={style.followTextContainer}>
                <Text style={style.followTextTop}>팔로잉</Text>
                <Text style={style.followTextBottom}>(아주 많음)</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={style.buttonContainer}>
          <RoundedButton
            onPress={() => {
              toast.show({
                description: "사실 이게 모델하우스 같은거라서요..",
              });
              setIsFollowed(!isFollowed);
            }}
            style={{
              flex: 1,
              fontSize: bFont.large,
              textAlignVertical: "center",
            }}
            buttonType={isFollowed ? "enabledBorder" : "enabledDark"}
          >
            {isFollowed ? "언팔로우" : "팔로우"}
          </RoundedButton>
          {isFollowed ? (
            <RoundedButton
              onPress={() => {
                toast.show({
                  description: "실제로 동작하는건 아닙니다.",
                });
                setIsSubscribed(!isSubscribed);
              }}
              style={{
                width: bSpace.xlarge * 2,
                marginLeft: bSpace.middle,
                fontSize: bFont.xlarge,
              }}
              iconData={{
                iconType: "material",
                materialIconName: isSubscribed
                  ? "notifications-off"
                  : "notifications-none",
              }}
              buttonType={isSubscribed ? "enabledBorder" : "enabledDark"}
            />
          ) : null}
          <RoundedButton
            onPress={() => {
              setMenuModalVisible(true);
            }}
            style={{
              width: bSpace.xlarge * 2,
              marginLeft: bSpace.middle,
              fontSize: bFont.xlarge,
            }}
            iconData={{
              iconType: "material",
              materialIconName: "more-horiz",
            }}
            buttonType="enabledBorder"
          />
        </View>
        <View style={style.statContainer}>
          <View style={style.countContainer}>
            <View style={style.countSection}>
              <Text style={style.countTextTop}>평균 점수</Text>
              <Text style={style.countTextBottom}>(낮음)</Text>
            </View>
            <View style={style.countSection}>
              <Text style={style.countTextTop}>받은 ❤️ 수</Text>
              <Text style={style.countTextBottom}>(적음)</Text>
            </View>
            <View style={style.countSection}>
              <Text style={style.countTextTop}>전체 시청 수</Text>
              <Text style={style.countTextBottom}>(많지 않음)</Text>
            </View>
          </View>
          <View style={style.verticalSeparator} />
          <View style={style.graphContainer}>
            <Text style={style.countTextTop}>점수 통계</Text>
            <Pressable
              onPress={() => {
                toast.show({ description: "보시다시피 그냥 이미지입니다." });
              }}
            >
              {assets ? (
                <Image
                  style={style.graphPlaceholder}
                  source={assets[1] as ImageSourcePropType}
                />
              ) : null}
            </Pressable>
          </View>
        </View>
        <View style={style.tasteContainer}>
          <View style={style.tasteSection}>
            <Text style={style.tasteTextTop}>주로 부르는 장르</Text>
            <Text style={style.tasteTextMiddle}>
              가 들어갈 자리지만 지금은 제 github 계정입니다.
            </Text>
            <Pressable
              style={style.linkButton}
              onPress={() => {
                Linking.openURL("https://github.com/anteater333");
              }}
            >
              {assets ? (
                <Image
                  style={style.linkButton}
                  source={assets[2] as ImageSourcePropType}
                />
              ) : null}
            </Pressable>
          </View>
          <View style={style.tasteSection}>
            <Text style={style.tasteTextTop}>주로 듣는 장르</Text>
            <Text style={style.tasteTextMiddle}>
              가 들어갈 자리지만 지금은 제 블로그입니다.
            </Text>
            <Pressable
              style={style.linkButton}
              onPress={() => {
                Linking.openURL("https://anteater333.github.io/");
              }}
            >
              {assets ? (
                <Image
                  style={style.linkButton}
                  source={assets[2] as ImageSourcePropType}
                />
              ) : null}
            </Pressable>
          </View>
          <View style={style.tasteSection}>
            <Text style={style.tasteTextTop}>좋아하는 가수</Text>
            <Text style={style.tasteTextMiddle}>
              가 들어갈 자리지만 지금은 제 메일 주소입니다.
            </Text>
            <Text
              style={style.linkText}
              onPress={() => {
                Clipboard.setString(myMailAddr);

                toast.show({ description: "복사되었습니다." });
              }}
            >
              {myMailAddr}
            </Text>
          </View>
          <View style={style.tasteSection}>
            <Text style={style.tasteTextTop}>실례가 안된다면</Text>
            <Text style={style.tasteTextMiddle}>커피 한 잔만 사주십시오.</Text>
            <Pressable
              style={style.linkButton}
              onPress={() => {
                Linking.openURL("https://www.buymeacoffee.com/anteater333");
              }}
            >
              {assets ? (
                <Image
                  style={style.linkButton}
                  source={assets[3] as ImageSourcePropType}
                />
              ) : null}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  rootContainer: {},
  menuContainer: {
    flexDirection: "row",
  },
  menuText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: bFont.large,
    height: bSpace.large * 3,
    borderColor: bColors.white,
    borderWidth: bSpace.small / 2,
  },
  menuTextSelected: {
    borderBottomColor: bColors.black,
  },
  profileContainer: {
    flexDirection: "row",
    margin: bSpace.xlarge,
  },
  profilePictureContainer: {
    flexDirection: "column",
    marginRight: bSpace.xlarge,
  },
  profilePicture: {
    width: bFont.middle * 10,
    height: bFont.middle * 10,
    borderRadius: (bFont.middle * 10) / 2,
  },
  profileLevelIconContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: bSpace.middle,
    height: bFont.large,
    paddingHorizontal: bSpace.small,
    alignItems: "center",
    justifyContent: "center",
  },
  profileLevelIcon: {
    fontSize: bFont.large,
  },
  profileLevelIconDeco: {
    flex: 1,
    height: bSpace.small / 2,
    backgroundColor: bColors.black,
    marginHorizontal: bSpace.small,
  },
  profileTextContainer: {
    flex: 1,
  },
  introductionContainer: {
    marginBottom: bSpace.middle,
  },
  myName: {
    fontSize: bFont.xlarge,
    fontWeight: "bold",
  },
  myNickname: {
    fontSize: bFont.middle,
    color: bColors.greyPrimary,
    marginBottom: bSpace.middle,
  },
  myComment: {
    fontSize: bFont.middle,
  },
  followContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: bSpace.middle,
  },
  verticalSeparator: {
    backgroundColor: bColors.greyTetiary,
    width: bSpace.small / 2,
    height: "100%",
  },
  followTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  followTextTop: {
    fontSize: bFont.large,
    marginBottom: bSpace.middle,
  },
  followTextBottom: {
    fontSize: bFont.small,
  },
  buttonContainer: {
    width: "100%",
    height: bSpace.xlarge * 2,
    flexDirection: "row",
    paddingHorizontal: bSpace.middle,
  },
  statContainer: {
    marginTop: bSpace.xlarge,
    paddingHorizontal: bSpace.xlarge,
    flexDirection: "row",
  },
  countContainer: {
    flex: 1.5,
    justifyContent: "space-between",
  },
  countSection: {},
  countTextTop: {
    fontSize: bFont.large,
  },
  countTextBottom: {
    fontSize: bFont.large,
  },
  graphContainer: {
    marginLeft: bSpace.xlarge,
    flex: 2,
  },
  graphPlaceholder: {
    alignSelf: "center",
    marginTop: bSpace.large,
  },
  tasteContainer: {
    marginTop: bSpace.xlarge,
    paddingHorizontal: bSpace.xlarge,
    resizeMode: "contain",
  },
  tasteSection: {
    marginBottom: bSpace.xlarge,
  },
  tasteTextTop: {
    fontSize: bFont.xlarge,
    fontWeight: "bold",
  },
  tasteTextMiddle: {
    fontSize: bFont.middle,
    marginBottom: bSpace.middle,
  },
  linkButton: {
    // 임시라서 그냥 하드코딩
    width: 32,
    height: 32,
  },
  linkText: {
    marginTop: -bSpace.large,
    fontSize: bFont.large,
    color: bColors.primary,
  },
});
