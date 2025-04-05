import { useNavigation } from "@react-navigation/native";
import Avvvatars from "avvvatars-react";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import QueResourceClient from "../../api/QueResourceUtils";
import { MainStackNavigationProp } from "../../navigators/MainNavigator";
import profilePictureStyles from "./ProfilePictureButton.style";

/** 컴포넌트 프로퍼티 타입, TouchableOpacityProp 처럼 동작할 수 있습니다. 인터페이스 상속을 통한 Union */
interface ProfilePictureProps extends TouchableOpacityProps {
  size?: number;
  userId: string;
  style?: StyleProp<ViewStyle & { fontSize?: number }>;
}

/** 프로필 사진을 포함한 버튼, 누르면 사용자 페이지로 이동합니다. TouchableOpacity 처럼 작동합니다. */
function ProfilePicture(props: ProfilePictureProps) {
  /** 페이지 전환을 위한 메인 네비게이터 사용 */
  const mainNavigator = useNavigation<MainStackNavigationProp>();

  /** 프로필 사진 URL */
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");

  /** 프로필 로딩 중 여부 */
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getDownloadUrl() {
      setProfileLoading(true);
      if (props.userId) {
        const downloadUrlResult = await QueResourceClient.getUserProfilePicture(
          props.userId
        );

        if (downloadUrlResult.success) {
          setProfilePictureUrl(downloadUrlResult.payload!);
        } else {
          setProfilePictureUrl("");
        }
      } else {
        setProfilePictureUrl("");
      }
      setProfileLoading(false);
    }

    getDownloadUrl();
  }, [props.userId]);

  /**
   * 카드 컴포넌트의 프로필 사진 영역을 눌렀을 때 실행됩니다.
   * 프로필을 업로드한 사용자의 Studio 페이지로 이동합니다.
   */
  const navigateToUserPage = useCallback(async () => {
    mainNavigator.navigate("UserPage", {
      userId: props.userId,
    });
  }, []);

  /** 상속받은 스타일에서 fontSize 추출 */
  const inheritedFontSize = props.style
    ? StyleSheet.flatten(props.style).fontSize
    : undefined;

  /** prop을 전달해 스타일 결정 */
  const styles = profilePictureStyles(
    props.size ? props.size : inheritedFontSize ? inheritedFontSize : undefined
  );
  return (
    <TouchableOpacity
      {...props}
      testID={props.testID ? props.testID : "profileButton"}
      onPress={navigateToUserPage}
      style={[props.style, styles.default]}
    >
      {profileLoading ? null : profilePictureUrl ? (
        <Image
          style={[styles.profilePic]}
          source={{ uri: profilePictureUrl }}
        />
      ) : (
        <View style={[styles.profilePic]}>
          <Avvvatars value={props.userId} style="shape" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default ProfilePicture;
