package com.ejiarens.wiseway;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import io.sentry.RNSentryPackage;
import me.jhen.react.BadgePackage;
import com.getui.reactnativegetui.GetuiPackage;
import io.rnkit.alertview.AlertViewPackage;
import com.yunpeng.alipay.AlipayPackage;
import com.wheelpicker.WheelPickerPackage;
import com.theweflex.react.WeChatPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import me.vanpan.rctqqsdk.QQSDKPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactlibrary.RNReactNativeDocViewerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.os.Bundle;
import com.getui.reactnativegetui.GetuiModule;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import com.burnweb.rnwebview.RNWebViewPackage;

import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
            new RNSentryPackage(MainApplication.this),
            new BadgePackage(),
            new GetuiPackage(),
            new AlertViewPackage(),
            new AlipayPackage(),
            new WheelPickerPackage(),
            new WeChatPackage(),
            new RNViewShotPackage(),
            new RCTSplashScreenPackage(),
            new QQSDKPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new RNReactNativeDocViewerPackage(),
            new VectorIconsPackage(),
            new RNWebViewPackage(),
            new RNDeviceInfo()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    GetuiModule.initPush(this);
  }
}
