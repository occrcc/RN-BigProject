package com.ejiarens.wiseway;

import com.facebook.react.ReactActivity;
import com.yunpeng.alipay.AlipayPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
import android.os.Bundle;
import com.getui.reactnativegetui.GetuiModule;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ejiaren_app";
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {

            RCTSplashScreen.openSplashScreen(this);   //open splashscreen
            //RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY);
            //open splashscreen fullscreen
            super.onCreate(savedInstanceState);
            GetuiModule.initPush(this);
    }
}
