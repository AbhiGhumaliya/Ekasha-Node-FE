export const startIcn = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" x="168" y="10" viewBox="0 0 8 8">
<path fill="#84C255" fill-rule="evenodd" d="M1.414 0H7c.552 0 1 .448 1 1v5.586c0 .552-.448 1-1 1-.265 0-.52-.106-.707-.293L.707 1.707c-.39-.39-.39-1.024 0-1.414C.895.105 1.15 0 1.414 0z"/>
</svg>`;

export const endIcn = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" x="168" y="10" viewBox="0 0 8 8">
<path fill="#FFF" fill-rule="evenodd" d="M6.586 8H1c-.552 0-1-.448-1-1V1.414c0-.552.448-1 1-1 .265 0 .52.106.707.293l5.586 5.586c.39.39.39 1.024 0 1.414-.188.188-.442.293-.707.293z"/>
</svg>`;

export const notesIcon = (id) => `<svg class="hoverEffect" height="25" width="25" x="17" y="95" >
<rect width="25" height="25" id="deletetask-${id}" rx="12.5" fill="#141517" />
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" x="6.5" y="5" viewBox="0 0 9 11">
<path fill="#4E8BFF" fill-rule="evenodd" stroke="#4E8BFF" stroke-width=".2" d="M8 3.158c0-.013 0-.026-.013-.039v-.012c0-.013-.013-.026-.025-.026L5.89 1.038c-.013-.013-.025-.013-.038-.025h-.013c-.013 0-.025 0-.038-.013H1.993C1.453 1 1 1.447 1 2.008v6.984C1 9.54 1.44 10 1.993 10h5.013C7.546 10 8 9.553 8 8.992L8 3.158h0zM5.926 1.434L7.56 3.03h-.905c-.402 0-.74-.332-.74-.753l-.001-.843h.012zm1.08 8.311H1.994c-.402 0-.741-.332-.741-.753V2.01c0-.408.327-.753.741-.753h3.67v1.021c0 .55.44 1.009.992 1.009h1.08v5.706c.014.422-.313.753-.728.753h0zm-.64-3.587c0 .077-.05.128-.125.128H2.81c-.076 0-.126-.051-.126-.128 0-.077.05-.128.126-.128h3.43c.063 0 .126.051.126.128zM2.646 4.6c0-.077.05-.128.126-.128h3.43c.076 0 .127.051.127.128 0 .077-.05.128-.126.128H2.772c-.063 0-.126-.064-.126-.128zm3.72 3.115c0 .077-.05.128-.125.128H2.81c-.076 0-.126-.05-.126-.128 0-.076.05-.127.126-.127h3.43c.063 0 .126.064.126.127z"/>
</svg>
</svg>`;

export const userIcn = `<svg class="hoverEffect" height="25" width="25" x="51" y="95" >
<rect width="25" height="25" rx="12.5" fill="#141517" />
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" x="6.5" y="5.5" viewBox="0 0 9 9">
<path fill="#4E8BFF" fill-rule="evenodd" d="M5.846 4.985c.785-.472 1.309-1.325 1.309-2.298C7.155 1.203 5.938 0 4.438 0 2.937 0 1.72 1.203 1.72 2.687c0 .973.524 1.824 1.308 2.298-1.512.563-2.59 2.01-2.59 3.7 0 .173.144.315.319.315.177 0 .319-.141.319-.315 0-1.775 1.413-3.229 3.186-3.319h.004c.057-.003.114-.005.172-.005.058 0 .115.002.173.005h.003C6.386 5.456 7.8 6.911 7.8 8.685c0 .173.143.315.32.315.175 0 .319-.141.319-.315 0-1.69-1.078-3.136-2.591-3.7zm-1.409-.243c-.053 0-.108-.002-.162-.008-1.072-.08-1.917-.968-1.917-2.047 0-1.133.932-2.055 2.08-2.055 1.145 0 2.078.921 2.078 2.055 0 1.079-.845 1.965-1.915 2.047-.055.007-.11.008-.164.008z"/>
</svg>
</svg>`;

// export const infoIcon = '';
export const infoIcon = (id) => `<svg class="hoverEffect" xmlns="http://www.w3.org/2000/svg" id="infoIconTooltip-${id}" height="13" width="13" x="152" y="73" viewBox="0 0 13 13">
<circle cx="6.5" cy="6.5" r="6.5" fill="#141517"/>
<g style="isolation:isolate">
<g style="isolation:isolate">
<path d="M6.4,9.5H5.22l.93-4.37H7.32ZM6.34,4.11a.66.66,0,0,1,.18-.51.72.72,0,0,1,.53-.18.67.67,0,0,1,.43.12.43.43,0,0,1,.15.35.77.77,0,0,1-.17.51.67.67,0,0,1-.53.19C6.53,4.59,6.34,4.43,6.34,4.11Z" fill="#fff"/>
</g>
</g>
</svg>`;
export const ActionDescTooltip = (id) => `<svg width="145" y="70" id="actionDescTooltip-${id}" height="17" style="cursor: pointer; opacity: 0">
<rect width="145" height="17" style="fill:red;" />
</svg>`;

export const ActionNameTooltip = (id) => `<svg width="185" y="49" id="actionNameTooltip-${id}" height="17" style="cursor: pointer; opacity: 0">
<rect width="185" height="17" style="fill:red;" />
</svg>`;

export const deleteIcn = (id) => `<svg class="hoverEffect" height="25" width="25" x="147" y="95" >
<rect width="25" height="25" id="deletetask-${id}" rx="12.5" fill="#141517" />
<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" x="6.5" y="6.2" viewBox="0 0 11 10">
<g fill="#4E8BFF" fill-rule="evenodd">
<path d="M7.722 3.547V8.227c0 .207.003.413 0 .62 0 .027-.002.056-.005.083.005-.04.012-.081.016-.12-.007.05-.021.098-.04.146.015-.037.032-.073.048-.11-.023.052-.052.098-.086.142l.075-.091c-.032.038-.069.073-.11.104l.097-.072c-.047.033-.096.06-.149.082l.114-.045c-.05.019-.1.031-.153.038l.126-.016c-.066.009-.134.006-.202.006H3.052c-.202 0-.403.002-.605 0-.028 0-.057-.002-.087-.006.042.006.085.012.127.016-.054-.007-.104-.02-.154-.038l.115.045c-.054-.022-.103-.049-.149-.082l.096.072c-.04-.03-.077-.066-.11-.104l.076.091c-.034-.044-.063-.09-.086-.141.015.036.033.072.048.109-.02-.048-.034-.097-.04-.147l.016.12c-.009-.066-.006-.135-.006-.202V4.21c0-.218.004-.436 0-.655v-.009c0-.237-.219-.465-.476-.454-.258.012-.476.2-.476.454V8.85c.003.372.21.723.548.911.253.14.517.143.793.143h4.86c.21 0 .425-.045.605-.154.326-.197.525-.532.529-.9V3.545c0-.237-.22-.465-.477-.454-.259.013-.476.201-.476.455zM9.454 1.548H.532c-.249 0-.488.209-.476.454.012.246.21.454.476.454H9.451c.249 0 .489-.209.477-.454-.01-.246-.207-.454-.474-.454z" transform="translate(.767)"/>
<path d="M3.607 2.002v-.99c0-.053-.003-.107.002-.159l-.017.12c.004-.025.01-.05.02-.073l-.047.109c.013-.028.028-.055.048-.08l-.075.092c.021-.025.044-.046.07-.066l-.097.072c.03-.023.064-.04.1-.056l-.114.046c.03-.012.062-.02.096-.025l-.126.015c.11-.012.223-.003.333-.003H6.161c.134 0 .273-.012.405.003L6.44.992c.025.004.05.01.074.019L6.4.965c.027.012.052.025.076.043C6.443.985 6.41.961 6.38.937c.019.014.035.031.052.05L6.357.895c.018.023.033.048.046.073L6.356.86c.014.033.023.065.028.1C6.38.92 6.372.88 6.368.84c.014.133.002.272.002.406v.759c0 .237.22.466.476.454.259-.011.477-.2.477-.454 0-.372.007-.746 0-1.118-.006-.35-.25-.707-.63-.77-.081-.014-.157-.02-.239-.02H3.528c-.236.002-.481.092-.643.26-.143.149-.225.328-.231.53V2.004c0 .238.219.466.476.455.259-.014.477-.202.477-.457zM3.483 3.547V7.147c0 .165-.004.331 0 .497v.007c0 .237.219.465.476.454.258-.011.477-.2.477-.454V4.052c0-.166.003-.332 0-.498v-.007c0-.237-.22-.465-.477-.454-.259.012-.476.2-.476.454zM5.577 3.547V7.147c0 .165-.003.331 0 .497v.007c0 .237.22.465.477.454.258-.011.476-.2.476-.454V4.052c0-.166.004-.332 0-.498v-.007c0-.237-.22-.465-.476-.454-.259.012-.477.2-.477.454z" transform="translate(.767)"/>
</g>
</svg>
</svg>`;

export const condIcn = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" x="55" y="-10" viewBox="0 0 21 21">
<g fill="#4E8BFF" fill-rule="evenodd">
<path d="M5.318 19.711C2.115 17.846.122 14.367.113 10.635l2.33-.005c.007 2.895 1.554 5.593 4.039 7.042l-1.164 2.04zm10.383-.01l-1.167-2.038c2.481-1.454 4.022-4.155 4.022-7.05l2.33-.039v.038c0 3.733-1.987 7.215-5.185 9.089zM6.454 3.57L5.282 1.534c3.139-1.847 7.236-1.86 10.381-.032l-1.16 2.042c-2.438-1.414-5.618-1.406-8.05.026zM10.5 14.504c-2.123 0-3.85-1.746-3.85-3.892 0-2.144 1.727-3.892 3.85-3.892 2.122 0 3.85 1.746 3.85 3.892 0 2.145-1.727 3.892-3.85 3.892zm0-5.429c-.84 0-1.52.689-1.52 1.537s.68 1.537 1.52 1.537 1.52-.689 1.52-1.537-.68-1.537-1.52-1.537z" transform="translate(0 .394)"/>
</g>
</svg>`;

export const notesIconCond = (id) => `<svg class="hoverEffect" height="30" width="30" x="55" y="30" >
<rect width="20" height="20" rx="10" id="notestask-${id}" fill="#141517" />
<svg xmlns="http://www.w3.org/2000/svg" width="11" height="13" x="4.5" y="3.2" viewBox="0 0 9 11">
<path fill="#4E8BFF" fill-rule="evenodd" stroke="#4E8BFF" stroke-width=".2" d="M8 3.158c0-.013 0-.026-.013-.039v-.012c0-.013-.013-.026-.025-.026L5.89 1.038c-.013-.013-.025-.013-.038-.025h-.013c-.013 0-.025 0-.038-.013H1.993C1.453 1 1 1.447 1 2.008v6.984C1 9.54 1.44 10 1.993 10h5.013C7.546 10 8 9.553 8 8.992L8 3.158h0zM5.926 1.434L7.56 3.03h-.905c-.402 0-.74-.332-.74-.753l-.001-.843h.012zm1.08 8.311H1.994c-.402 0-.741-.332-.741-.753V2.01c0-.408.327-.753.741-.753h3.67v1.021c0 .55.44 1.009.992 1.009h1.08v5.706c.014.422-.313.753-.728.753h0zm-.64-3.587c0 .077-.05.128-.125.128H2.81c-.076 0-.126-.051-.126-.128 0-.077.05-.128.126-.128h3.43c.063 0 .126.051.126.128zM2.646 4.6c0-.077.05-.128.126-.128h3.43c.076 0 .127.051.127.128 0 .077-.05.128-.126.128H2.772c-.063 0-.126-.064-.126-.128zm3.72 3.115c0 .077-.05.128-.125.128H2.81c-.076 0-.126-.05-.126-.128 0-.076.05-.127.126-.127h3.43c.063 0 .126.064.126.127z"/>
</svg>
</svg>`;

export const deleteIcnCond = (id) => `<svg class="hoverEffect" height="30" width="30" x="55" y="-50" >
<rect width="20" height="20" id="deletetask-${id}" rx="10" fill="#141517" />
<svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" x="5.5" y="4" viewBox="0 0 11 10">
<g fill="#4E8BFF" fill-rule="evenodd">
<path d="M7.722 3.547V8.227c0 .207.003.413 0 .62 0 .027-.002.056-.005.083.005-.04.012-.081.016-.12-.007.05-.021.098-.04.146.015-.037.032-.073.048-.11-.023.052-.052.098-.086.142l.075-.091c-.032.038-.069.073-.11.104l.097-.072c-.047.033-.096.06-.149.082l.114-.045c-.05.019-.1.031-.153.038l.126-.016c-.066.009-.134.006-.202.006H3.052c-.202 0-.403.002-.605 0-.028 0-.057-.002-.087-.006.042.006.085.012.127.016-.054-.007-.104-.02-.154-.038l.115.045c-.054-.022-.103-.049-.149-.082l.096.072c-.04-.03-.077-.066-.11-.104l.076.091c-.034-.044-.063-.09-.086-.141.015.036.033.072.048.109-.02-.048-.034-.097-.04-.147l.016.12c-.009-.066-.006-.135-.006-.202V4.21c0-.218.004-.436 0-.655v-.009c0-.237-.219-.465-.476-.454-.258.012-.476.2-.476.454V8.85c.003.372.21.723.548.911.253.14.517.143.793.143h4.86c.21 0 .425-.045.605-.154.326-.197.525-.532.529-.9V3.545c0-.237-.22-.465-.477-.454-.259.013-.476.201-.476.455zM9.454 1.548H.532c-.249 0-.488.209-.476.454.012.246.21.454.476.454H9.451c.249 0 .489-.209.477-.454-.01-.246-.207-.454-.474-.454z" transform="translate(.767)"/>
<path d="M3.607 2.002v-.99c0-.053-.003-.107.002-.159l-.017.12c.004-.025.01-.05.02-.073l-.047.109c.013-.028.028-.055.048-.08l-.075.092c.021-.025.044-.046.07-.066l-.097.072c.03-.023.064-.04.1-.056l-.114.046c.03-.012.062-.02.096-.025l-.126.015c.11-.012.223-.003.333-.003H6.161c.134 0 .273-.012.405.003L6.44.992c.025.004.05.01.074.019L6.4.965c.027.012.052.025.076.043C6.443.985 6.41.961 6.38.937c.019.014.035.031.052.05L6.357.895c.018.023.033.048.046.073L6.356.86c.014.033.023.065.028.1C6.38.92 6.372.88 6.368.84c.014.133.002.272.002.406v.759c0 .237.22.466.476.454.259-.011.477-.2.477-.454 0-.372.007-.746 0-1.118-.006-.35-.25-.707-.63-.77-.081-.014-.157-.02-.239-.02H3.528c-.236.002-.481.092-.643.26-.143.149-.225.328-.231.53V2.004c0 .238.219.466.476.455.259-.014.477-.202.477-.457zM3.483 3.547V7.147c0 .165-.004.331 0 .497v.007c0 .237.219.465.476.454.258-.011.477-.2.477-.454V4.052c0-.166.003-.332 0-.498v-.007c0-.237-.22-.465-.477-.454-.259.012-.476.2-.476.454zM5.577 3.547V7.147c0 .165-.003.331 0 .497v.007c0 .237.22.465.477.454.258-.011.476-.2.476-.454V4.052c0-.166.004-.332 0-.498v-.007c0-.237-.22-.465-.476-.454-.259.012-.477.2-.477.454z" transform="translate(.767)"/>
</g>
</svg>
</svg>`;

export const filterApply = () => `<defs>
<filter id="solid" primitiveUnits="objectBoundingBox">
  <feImage preserveAspectRatio="none" width="110%" height="110%" x="-5%" y="0%"  xlink:href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 390 20' height='20' width='400'%3E%3Crect fill='black' x='0' y='0' rx='0' ry='0' width='392' height='20'/%3E%3C/svg%3E"/>
  <feComposite operator="over" in="SourceGraphic"/>
</filter>
</defs>`;

// success and fail icons
export const errorIcn = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" x="160" y="12" viewBox="0 0 8 8">
<rect height="7px" width="7px" rx="1" fill="#902a2a"/>
</svg>`;

export const successIcn = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" x="160" y="12" viewBox="0 0 8 8">
<path fill="#84C255" fill-rule="evenodd" d="M8 7c0 .552-.448 1-1 1H1.017C.742 8 .48 7.887.29 7.688c-.38-.4-.363-1.034.037-1.414L2.726 4 .328 1.726C-.072 1.346-.089.713.291.312.48.112.742 0 1.017 0H7c.552 0 1 .448 1 1z"/>
</svg>`;

export const InnerShadow = () => `<filter id='inset-shadow'>
<feGaussianBlur
          stdDeviation='3'
          result='offset-blur'
        />
  <!-- Invert drop shadow to make an inset shadow-->
  <feComposite
          operator='out'
          in='SourceGraphic'
          in2='offset-blur'
          result='inverse'
        />
  <!-- Cut colour inside shadow -->
  <feFlood
          flood-color='#c92128'
          flood-opacity='0.5'
          result='color'
        />
  <feComposite
          operator='in'
          in='color'
          in2='inverse'
          result='shadow'
        />
  <!-- Placing shadow over element -->
  <feComposite
          operator='over'
          in='shadow'
          in2='SourceGraphic'
        />
</filter>`;

export const endN = () => `${InnerShadow()}<g class="scalableIcon" transform="scale(1,1)"><rect class="body animatedRect"/></g><rect class="line1"/><text class="dDesc" x="45" y="58"/><text class="label" x="-50" y="10"/>${endIcn}`;

export const startN = () => `${InnerShadow()}<g class="scalableIcon" transform="scale(1,1)"><rect class="body"/></g><rect class="line1"/><text class="dDesc" x="45" y="58"/><text class="label" x="-50" y="10"/>${startIcn}`;

export const otherTaskN = (task, saveType) => `${InnerShadow()}<g class="scalable" transform="scale(1,1)"><rect class="body"/></g><rect class="line1"/><rect class="line2"/>
<svg xmlns="http://www.w3.org/2000/svg" class="taskNotInField" data-name="taskNotInField" width="12" height="12" x="120" y="15" viewBox="0 0 50 50">
  <path d="M22.27,17.37a10.54,10.54,0,0,1,8.08,4,2.3,2.3,0,0,1,0,3.2,2.63,2.63,0,0,1-3.53.19,5,5,0,0,1-.51-.52A5.61,5.61,0,0,0,18.08,24Q13,29,8,34A5.39,5.39,0,0,0,6.61,39.7,5.3,5.3,0,0,0,11,43.56a5.47,5.47,0,0,0,5-1.62q3.72-3.7,7.43-7.44a.76.76,0,0,1,.86-.22,13.17,13.17,0,0,0,4.63.5.87.87,0,0,1,.64.17c.21.28-.08.48-.27.67-3,3-6,6-9,9a17,17,0,0,1-2.5,2.16,10.51,10.51,0,0,1-16.11-6.5,10,10,0,0,1,2.7-9.58c3.41-3.51,6.89-6.95,10.38-10.38A10.36,10.36,0,0,1,22.27,17.37Z" fill="#fec20f" />
  <path d="M38.09,1.44a10.42,10.42,0,0,1,10.4,9,10.19,10.19,0,0,1-3,9c-3.33,3.38-6.7,6.72-10.06,10.07a10.58,10.58,0,0,1-15.79-.85,2.32,2.32,0,0,1,0-3.21,2.64,2.64,0,0,1,3.53-.18c.18.16.34.34.51.52A5.6,5.6,0,0,0,32,26c3.37-3.35,6.75-6.71,10.09-10.1a5.34,5.34,0,0,0,1.35-5.7,5.62,5.62,0,0,0-9.25-2.29c-2.54,2.49-5,5-7.56,7.54a.81.81,0,0,1-.92.24,13,13,0,0,0-4.76-.48c-.16,0-.43-.08-.46-.18a.58.58,0,0,1,.13-.52c3.4-3.43,6.8-6.86,10.24-10.24A10.39,10.39,0,0,1,38.09,1.44Z" fill="#fec20f" />
</svg>
${filterApply()}
<text class="dName" x="45" y="58"/><text class="dDesc" x="45" y="78"/><text class="label" x="-50" y="10"/>
<text class="wrongField" id="wrongField${task.id}" filter="none" visibility="hidden" x="170" y="10" />
${ActionDescTooltip(task.id)}${infoIcon(task.id)
}${notesIcon(task.id)
}${saveType === 'preview' ? '' : deleteIcn(task.id)}
<text class="infoTooltip" id="tInfoId${task.id}" filter="none" visibility="hidden" x="170" y="55" />
<text class="dDescTooltip" id="tDescId${task.id}" filter="none" visibility="hidden" x="20" y="55" />`;

export const actionN = (task, saveType) => `${InnerShadow()}<g class="scalable" transform="scale(1,1)"><rect class="body actionAnimation"/></g><rect class="line1"/><rect class="line2"/><text class="label" x="-50" y="10"/><text class="playTaskId" x="190" y="21"/>
${saveType === 'preview' ? '' : `<svg xmlns="http://www.w3.org/2000/svg" class="taskNotInField" data-name="taskNotInField" width="12" height="12" x="120" y="15" viewBox="0 0 50 50">
<path d="M22.27,17.37a10.54,10.54,0,0,1,8.08,4,2.3,2.3,0,0,1,0,3.2,2.63,2.63,0,0,1-3.53.19,5,5,0,0,1-.51-.52A5.61,5.61,0,0,0,18.08,24Q13,29,8,34A5.39,5.39,0,0,0,6.61,39.7,5.3,5.3,0,0,0,11,43.56a5.47,5.47,0,0,0,5-1.62q3.72-3.7,7.43-7.44a.76.76,0,0,1,.86-.22,13.17,13.17,0,0,0,4.63.5.87.87,0,0,1,.64.17c.21.28-.08.48-.27.67-3,3-6,6-9,9a17,17,0,0,1-2.5,2.16,10.51,10.51,0,0,1-16.11-6.5,10,10,0,0,1,2.7-9.58c3.41-3.51,6.89-6.95,10.38-10.38A10.36,10.36,0,0,1,22.27,17.37Z" fill="#fec20f" />
<path d="M38.09,1.44a10.42,10.42,0,0,1,10.4,9,10.19,10.19,0,0,1-3,9c-3.33,3.38-6.7,6.72-10.06,10.07a10.58,10.58,0,0,1-15.79-.85,2.32,2.32,0,0,1,0-3.21,2.64,2.64,0,0,1,3.53-.18c.18.16.34.34.51.52A5.6,5.6,0,0,0,32,26c3.37-3.35,6.75-6.71,10.09-10.1a5.34,5.34,0,0,0,1.35-5.7,5.62,5.62,0,0,0-9.25-2.29c-2.54,2.49-5,5-7.56,7.54a.81.81,0,0,1-.92.24,13,13,0,0,0-4.76-.48c-.16,0-.43-.08-.46-.18a.58.58,0,0,1,.13-.52c3.4-3.43,6.8-6.86,10.24-10.24A10.39,10.39,0,0,1,38.09,1.44Z" fill="#fec20f" />
</svg>`}
${task.configrationStatus === false ? `<svg width="12" height="12" x="140" y="15" viewBox="0 0 50 50">
<path d="M49.9,45.9a7.84,7.84,0,0,0-.5-1.4Q38.3,23.35,27.4,2.2c-.5-1-1-2.2-2.4-2.2s-1.9,1.1-2.4,2.1Q11.65,23.25.7,44.3C-.6,46.8-.1,49.1,3.6,49c7.1-.1,14.3,0,21.4,0H46.3a9.7,9.7,0,0,0,1.7-.1A2.26,2.26,0,0,0,49.9,45.9ZM21.7,14.3A3,3,0,0,1,24.9,11a3.1,3.1,0,0,1,3.3,3.3V31a3,3,0,0,1-3.3,3.3A3,3,0,0,1,21.7,31V14.3Zm3.2,29.6a3.42,3.42,0,0,1-3.5-3.5,3.5,3.5,0,1,1,7,.1A3.34,3.34,0,0,1,24.9,43.9Z" fill="#ff4a4a" />
</svg>` : ''}
${filterApply()}
<text class="dName" style="cursor: pointer;" x="45" y="58"/><text class="dDesc" style="cursor: pointer;" x="45" y="78"/>
${saveType === 'preview' ? '' : `<text class="wrongField" id="wrongField${task.id}" filter="none" visibility="hidden" x="170" y="10" />`}
${ActionNameTooltip(task.id)}${ActionDescTooltip(task.id)}${infoIcon(task.id)
}${task.configrationStatus === true ? userIcn : ''}
${notesIcon(task.id)}
${saveType === 'preview' ? '' : deleteIcn(task.id)}
<text class="infoTooltip" id="tInfoId${task.id}" filter="none" visibility="hidden" x="170" y="55" />
<text class="dNameTooltip" id="tDnameId${task.id}" filter="none" visibility="hidden" x="20" y="45" />
<text class="dDescTooltip" id="tDescId${task.id}" filter="none" visibility="hidden" x="20" y="55" />`;

export const playbookN = (task, saveType) => `${InnerShadow()}<g class="scalable" transform="scale(1,1)"><rect class="body"/></g><rect class="line1"/><rect class="line2"/>${filterApply()}
<text class="dName" x="45" y="58"/><text class="dDesc" x="45" y="78"/><text class="label" x="-50" y="10"/><text class="playTaskId" x="200" y="20"/>
${ActionNameTooltip(task.id)}
${notesIcon(task.id)}${saveType === 'preview' ? '' : deleteIcn(task.id)}
<text class="dNameTooltip" id="tDnameId${task.id}" filter="none" visibility="hidden" x="20" y="45" />`;

export const titleN = (task, saveType) => `${InnerShadow()}<g class="scalable" transform="scale(1,1)"><rect class="body"/></g><rect class="line1"/><rect class="line2"/>${filterApply()}
<text class="dName" x="45" y="58"/><text class="dDesc" x="45" y="78"/><text class="label" x="-50" y="10"/><text class="playTaskId" x="200" y="20"/>
${ActionNameTooltip(task.id)}${ActionDescTooltip(task.id)}
${notesIcon(task.id)}${saveType === 'preview' ? '' : deleteIcn(task.id)}
<text class="dNameTooltip" id="tDnameId${task.id}" filter="none" visibility="hidden" x="20" y="45" />
<text class="dDescTooltip" id="tDescId${task.id}" filter="none" visibility="hidden" x="20" y="55" />`;

export const conditionN = (task, saveType) => ` ${InnerShadow()}<g class="scalable" transform="scale(1,1)">
<rect class="body" style="transform: rotate(-45deg);"/><text class="playTaskId" x="160" y="-20"/></g>
${filterApply()}
<text class="wrongField" id="wrongField${task.id}" filter="none" visibility="hidden" x="25" y="-10" />${condIcn
}${notesIconCond(task.id)
}${saveType === 'preview' ? '' : deleteIcnCond(task.id)}${saveType === 'preview' ? '' : `<svg class="taskNotInField" data-name="taskNotInField" height="30" width="30" x="15" y="-10" ><rect width="20" height="20" id="deletetask-3" rx="10" fill="#141517"></rect><svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" x="5" y="5" viewBox="0 0 50 50">
<path d="M22.27,17.37a10.54,10.54,0,0,1,8.08,4,2.3,2.3,0,0,1,0,3.2,2.63,2.63,0,0,1-3.53.19,5,5,0,0,1-.51-.52A5.61,5.61,0,0,0,18.08,24Q13,29,8,34A5.39,5.39,0,0,0,6.61,39.7,5.3,5.3,0,0,0,11,43.56a5.47,5.47,0,0,0,5-1.62q3.72-3.7,7.43-7.44a.76.76,0,0,1,.86-.22,13.17,13.17,0,0,0,4.63.5.87.87,0,0,1,.64.17c.21.28-.08.48-.27.67-3,3-6,6-9,9a17,17,0,0,1-2.5,2.16,10.51,10.51,0,0,1-16.11-6.5,10,10,0,0,1,2.7-9.58c3.41-3.51,6.89-6.95,10.38-10.38A10.36,10.36,0,0,1,22.27,17.37Z" fill="#fec20f" />
<path d="M38.09,1.44a10.42,10.42,0,0,1,10.4,9,10.19,10.19,0,0,1-3,9c-3.33,3.38-6.7,6.72-10.06,10.07a10.58,10.58,0,0,1-15.79-.85,2.32,2.32,0,0,1,0-3.21,2.64,2.64,0,0,1,3.53-.18c.18.16.34.34.51.52A5.6,5.6,0,0,0,32,26c3.37-3.35,6.75-6.71,10.09-10.1a5.34,5.34,0,0,0,1.35-5.7,5.62,5.62,0,0,0-9.25-2.29c-2.54,2.49-5,5-7.56,7.54a.81.81,0,0,1-.92.24,13,13,0,0,0-4.76-.48c-.16,0-.43-.08-.46-.18a.58.58,0,0,1,.13-.52c3.4-3.43,6.8-6.86,10.24-10.24A10.39,10.39,0,0,1,38.09,1.44Z" fill="#fec20f" />
</svg></svg>`}`;
