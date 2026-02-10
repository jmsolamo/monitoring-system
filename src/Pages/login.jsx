import { useEffect, useRef, useState } from "react";

const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const blurClassMap = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

function SmokeyBackground({ backdropBlurAmount = "sm", color = "#1E40AF", className = "" }) {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");

    let startTime = Date.now();
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering, mousePosition, color]);

  const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["sm"];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`}></div>
    </div>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/enertech/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail,
          password: password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.role === '1') {
          window.location.href = '/actual-expenses';
        } else {
          alert('Login successful!');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Sign in to continue</h2>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="relative z-0">
          <i className='bx bx-user absolute left-0 top-3 text-gray-300'></i>
          <input
            type="text"
            id="floating_email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" " 
            required
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 left-8 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Username or Email
          </label>
        </div>
        <div className="relative z-0">
          <i className='bx bx-lock-alt absolute left-0 top-3 text-gray-300'></i>
          <input
            type={showPassword ? "text" : "password"}
            id="floating_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block py-2.5 px-8 pr-10 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 left-8 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <i 
            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} absolute right-0 top-3 text-gray-300 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button
          type="submit"
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
        >
          Sign In
          <span className="ml-2">→</span>
        </button>

      </form>
       <p className="text-center text-xs text-gray-400">
        Don't have an account? <a href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition">Sign Up</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <LoginForm />
      </div>
    </main>
  );
}
