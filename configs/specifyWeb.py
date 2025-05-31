from pathlib import Path
import shutil
import soundfile as sf
import numpy as np
import yaml

def align_audio_length(audio1_path, audio2_path):
    """对齐两个音频文件的长度"""
    audio1, sample_rate = sf.read(audio1_path)
    audio2, _ = sf.read(audio2_path)

    if len(audio1) < len(audio2):
        audio2 = audio2[:len(audio1)]
    elif len(audio1) > len(audio2):
        audio2 = np.pad(audio2, (0, len(audio1) - len(audio2)), mode='constant')

    sf.write(audio2_path, audio2, sample_rate)

# ====================== 配置参数 ======================
# 主资源目录
resources_dir = Path("D:/webMushra/raconiy.github.io/configs/resources")
# 需要对比的三个目录
method_dirs = ["opensource", "original", "switch"]
# 输出目录（存放分类后的样本）
output_dir = resources_dir / "samples"
# YAML配置文件路径
yaml_path = Path("D:/webMushra/raconiy.github.io/configs") / "MOS_Comparison.yaml"

# ====================== 准备阶段 ======================
# 确保输出目录存在
output_dir.mkdir(parents=True, exist_ok=True)

# 获取所有样本ID（基于original目录）
idx_list = [f.stem for f in (resources_dir / "original").glob("*.wav")]

# ====================== 分类音频文件 ======================
print("开始分类音频文件...")
for idx in idx_list:
    # 为每个样本创建单独目录
    sample_dir = output_dir / idx
    sample_dir.mkdir(exist_ok=True)
    
    # 复制三个目录中的对应文件
    for method in method_dirs:
        src_file = resources_dir / method / f"{idx}.wav"
        dest_file = sample_dir / f"{idx}_{method}.wav"
        
        if src_file.exists():
            shutil.copy(src_file, dest_file)
            print(f"复制: {src_file} -> {dest_file}")
        else:
            print(f"警告: 文件不存在 - {src_file}")

print("\n======================== 分类完成 ========================\n")

# ====================== 对齐音频长度 ======================
print("开始对齐音频长度...")
for idx in idx_list:
    sample_dir = output_dir / idx
    # 以original作为参考长度基准
    ref_audio = sample_dir / f"{idx}_original.wav"
    
    if not ref_audio.exists():
        print(f"跳过 {idx} - 找不到参考音频")
        continue
    
    for audio_file in sample_dir.glob("*.wav"):
        if audio_file != ref_audio:
            align_audio_length(ref_audio, audio_file)
            print(f"已对齐: {audio_file.name} -> 参考 {ref_audio.name}")

print("\n======================== 对齐完成 ========================\n")

# ====================== 生成YAML配置文件 ======================
print("生成YAML配置文件...")

# 创建基础YAML结构
yaml_data = {
    "title": "音频处理方法对比评测",
    "pages": [
        {
            "type": "instructions",
            "title": "评测说明",
            "text": "请对比以下三种音频处理方法的音质。使用滑块给出评分（0-100分），分数越高表示音质越好。"
        },
        {
            "type": "mushra",
            "title": "音频质量对比",
            "stimuli": [],
            "reference": "hidden",  # 隐藏参考样本
            "visualization": "stars",  # 使用星型评分
            "randomize": True  # 随机顺序
        }
    ]
}

# 添加测试样本
for i, idx in enumerate(idx_list):
    test_case = {
        "id": f"sample_{i+1}",
        "name": f"样本 {i+1}/{len(idx_list)}",
        "reference": f"./configs/resources/samples/{idx}/{idx}_original.wav",
        "stimuli": {}
    }
    
    for method in method_dirs:
        stimulus_id = method
        # 美化显示名称
        display_name = {
            "opensource": "音频1",
            "original": "音频2",
            "switch": "音频3"
        }.get(method, method)
        
        test_case["stimuli"][display_name] = f"./configs/resources/samples/{idx}/{idx}_{method}.wav"
    
    yaml_data["pages"][1]["stimuli"].append(test_case)

# 保存YAML文件
with open(yaml_path, "w", encoding="utf-8") as f:
    yaml.safe_dump(yaml_data, f, allow_unicode=True, sort_keys=False)
    print(f"配置文件已保存至: {yaml_path}")

print("\n======================== 全部完成 ========================")
