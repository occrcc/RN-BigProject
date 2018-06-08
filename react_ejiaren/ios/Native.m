//
//  Native.m
//  demoProject
//
//  Created by UCPSL on 2018/2/6.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "Native.h"
@implementation Native

// 导出模块，不添加参数即默认为这个类名
RCT_EXPORT_MODULE();

// 导出方法，桥接到js的方法返回值类型必须是void
RCT_EXPORT_METHOD(addBadgeNumber:(int)number){
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:number];
}


// 导出方法，桥接到js的方法返回值类型必须是void
RCT_EXPORT_METHOD(saveAppXHLaunchAd:(NSString *)startImageUrl){
  RCTLogInfo(@"启动图片: %@",startImageUrl);
  [[NSUserDefaults standardUserDefaults] setObject:startImageUrl forKey:@"startImage"];
}

//  对外提供调用方法,演示Callback
RCT_EXPORT_METHOD(testCallbackEventOne:(NSString *)name callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"传进来的: %@",name);
  NSArray *events=@[@"1", @"2", @"3",@"4"]; //准备回调回去的数据
  callback(@[[NSNull null],events]);
}

@end
