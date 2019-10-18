# Vue extends拓展任意组件功能(el-select实例)-两种写法
用到ElementUI的select组件，要求能够多选并且重复选择。如果直接使用的话，首先`el-tag`会报错，因为循环中key值重复；其次，他的移除是通过indexof搜索移除的tag的值，且在remove-tag事件中未抛出被移除tag的索引，这样的后果是存在多个相同值的tag时，只会移除第一个相同值的tag

## 思路
在`el-tag`的循环中，给`close`事件增加一个参数`index`，然后重写`deleteTag`方法，直接通过index删除该tag
1. Vue: `@close="deleteTag($event, item)"`
2. JSX: `on-close={e => this.deleteTag(e, this.selected[0])}`

```js
deleteTag(event, tag, tagIndex){
  const value = this.value.slice();
  value.splice(tagIndex, 1);// 核心代码，其他代码省略
}
```

## 写法一、Vue template(推荐)
非常简单，改动特别少，可以使用Vue的所有用法，只需要复制el-select的template
1. 新建一个vue文件
2. 复制`el-select`的template模板内容过来
3. 导入`el-select`,继承
4. 覆盖`methods`中的`deleteTag`

### 结果
```vue
<template>
  <div
    class="el-select"
    :class="[selectSize ? 'el-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose">
    我是示例代码，此处为自定义模板内容
  </div>
</template>

<script>
  import { Select} from 'element-ui';
  export default {
    extends: Select,//继承
    name: 'my-el-select',
    methods: {
      deleteTag(event, tag, tagIndex) {
// 重写该方法
    },
  },
  };
</script>

```


## 写法二、JSX(比较麻烦)
需要手动将Vue template转为jsx写法，无法使用事件修饰符，部分指令等等，改动比较大
### 1、导入继承
```jsx harmony
import {Select} from 'element-ui';

const myElSelect = {
  extends: Select
}
```
### 2、 重写render
Vue template最终编译之后也是生成render函数，这里覆盖render函数，
生成自定义内容。此处的意义只是为了记录以便于方便我用render函数时的jsx写法
```jsx harmony
render()
{
    const tagContent = () => {
      if (this.collapseTags && this.selected.length) {
        const tag0 = (
          <el-tag
            closable={!this.selectDisabled}
            size={this.collapseTagSize}
            hit={this.selected[0].hitState}
            type='info'
            on-close={e => this.deleteTag(e, this.selected[0])}
            disable-transitions={true}>
            <span class='el-select__tags-text'>{this.selected[0].currentLabel}</span>
          </el-tag>
        );
        const tag1 = (
          <el-tag
            closable={false}
            size={this.collapseTagSize}
            type='info'
            disable-transitions={true}>
            <span class='el-select__tags-text'>+ {this.selected.length - 1}</span>
          </el-tag>
        );

        if (this.selected.length > 1) {
          return (
            <span>
              {tag0}
              {tag1}
            </span>
          );
        }
        return (
          <span>
            {tag0}
          </span>
        );
      }
    };
    const emptyText = () => {
      if (this.emptyText && (!this.allowCreate || this.loading || (this.allowCreate && this.options.length === 0))) {
        return (
          <p class='el-select-dropdown__empty'>{this.emptyText}</p>
        );
      }
    };
    const selectOption = () => {
      return (
        <transition
          name='el-zoom-in-top'
          on-before-enter={this.handleMenuEnter}
          on-after-leave={this.doDestroy}>
          <el-select-menu
            ref='popper'
            append-to-body={this.popperAppendToBody}
            v-show={this.visible && this.emptyText !== false}>
            <el-scrollbar
              tag='ul'
              wrap-class='el-select-dropdown__wrap'
              view-class='el-select-dropdown__list'
              ref='scrollbar'
              class={{'is-empty': !this.allowCreate && this.query && this.filteredOptionsCount === 0}}
              v-show={this.options.length > 0 && !this.loading}>
              {this.showNewOption ? (
                <el-option
                  value={this.query}
                  created={true}>
                </el-option>
              ) : null}
              {
                this.$slots.default
              }
            </el-scrollbar>
            {emptyText()}
          </el-select-menu>
        </transition>
      );
    };
    return (
      <div
        class={['el-select', this.selectSize ? 'el-select--' + this.selectSize : '']}
        on-click={this.toggleMenu} v-clickoutside={this.handleClose}>
        <div
          class='el-select__tags'
          ref='tags'
          style={{'max-width': this.inputWidth - 32 + 'px'}}>
          {tagContent()}
          <transition-group onAfterLeave={this.resetInputHeight}>
            {this.selected.map((item, index) => {
              return (
                <el-tag
                  key={index}
                  closable={!this.selectDisabled}
                  size={this.collapseTagSize}
                  hit={item.hitState}
                  type='info'
                  on-close={(e) => this.deleteTag(e, item, index)}
                  disable-transitions={false}>
                  <span class='el-select__tags-text'>{item.currentLabel}</span>
                </el-tag>
              );
            })}
          </transition-group>
        </div>
        <el-input
          ref='reference'
          value={this.selectedLabel}
          type='text'
          placeholder={this.currentPlaceholder}
          name={this.name}
          id={this.id}
          auto-complete={this.autoComplete}
          size={this.selectSize}
          disabled={this.selectDisabled}
          readonly={this.readonly}
          validate-event={false}
          class={{'is-focus': this.visible}}
          on-focus={this.handleFocus}
          on-blur={this.handleBlur}
          on-keyup_native={this.debouncedOnInputChange}
          on-paste_native={this.debouncedOnInputChange}
          on-mouseenter_native={(this.inputHovering = true)}
          on-mouseleave_native={(this.inputHovering = false)}
        >
          <i slot='suffix'
             class={['el-select__caret', 'el-input__icon', 'el-icon-' + this.iconClass]}
             on-click={() => this.handleIconClick}/>
        </el-input>
        {selectOption()}
      </div>
    );
  }
```
### 3、 重写method里的deleteTag方法
### 4、结果
```jsx harmony
import {Select} from 'element-ui';

const myElSelect = {
  extends: Select,
  methods: {
    deleteTag(event, tag, tagIndex) {
     // *****
    },
  },
  render() {
    return (
      <div>例子</div>
    );
  }
};
export default myElSelect;
```
