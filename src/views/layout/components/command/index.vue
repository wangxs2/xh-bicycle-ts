<template>
  <div class="command-box">
    <slideshow parendClassName="command-box"
               v-if="initSwiper"
               :options="swiperOption">
      <div class="swiper-slide"
           v-for="(item,index) in townDataing"
           :key="index">
        <div class="command-content">
          <div class="town-item"
               v-for="(subItem,subIndex) in item"
               :key="subIndex">
            <div class="town-item-one">
              <div class="town-name">{{subItem.name}}</div>
              <div class="phone-tit">值班电话</div>
            </div>
            <div class="town-item-rest">
              <div class="rest-left">分管领导</div>
              <div class="rest-right">{{subItem.phone1}}</div>
            </div>
            <div class="town-item-rest">
              <div class="rest-left">分中心常务副主任</div>
              <div class="rest-right">{{subItem.phone2}}</div>
            </div>
          </div>
        </div>
      </div>
    </slideshow>
  </div>
</template>


<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>