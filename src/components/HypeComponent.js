import React, { useEffect, useRef } from 'react';

function HypeComponent({ name }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 动态加载HYPE生成的脚本
    const script = document.createElement('script');
    script.src = `../res/HYPE/${name}.hyperesources/${name}_hype_generated_script.js?1`;
    script.async = true;

    // 将脚本添加到指定的div中
    containerRef.current.appendChild(script);

    // 清除脚本以防止重复加载
    return () => {
      containerRef.current.removeChild(script);
    };
  }, [name]);

  return (
    <div ref={containerRef} id={`${name}_hype_container`} className="hype-main need-resize">
    </div>
  );
}

export default HypeComponent;
