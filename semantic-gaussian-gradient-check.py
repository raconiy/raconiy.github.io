"""Synthetic 1D projected-splat check; NOT a LingBot-Map experiment."""
import math,json
from pathlib import Path
pixels=[-1+i/100 for i in range(201)]
def render(mu,fg=1.,bg=0.):
 return [(.8*math.exp(-.5*((x-mu)/.25)**2))*fg+(1-.8*math.exp(-.5*((x-mu)/.25)**2))*bg for x in pixels]
def loss(mu,target,fg=1.,bg=0.):return sum((a-b)**2 for a,b in zip(render(mu,fg,bg),target))/len(target)
def derivative(mu,target,fg=1.,bg=0.):
 h=1e-5;return (loss(mu+h,target,fg,bg)-loss(mu-h,target,fg,bg))/(2*h)
target=render(0.);start=.2;g=derivative(start,target);mu=start
for _ in range(30):mu-=.1*derivative(mu,target)
result={'scope':'1D synthetic projected Gaussian, fixed opacity/scale/features, only center optimized; no network, pose, memory or real images','initial_center':start,'initial_loss':loss(start,target),'initial_gradient':g,'after_30_steps_center':mu,'after_30_steps_loss':loss(mu,target),'identical_feature_gradient':derivative(start,render(0.,1.,1.),1.,1.),'detached_geometry_gradient':'zero by construction, not an autodiff execution'}
assert g>0 and loss(mu,target)<loss(start,target)
assert abs(result['identical_feature_gradient'])<1e-9
Path(__file__).with_name('gradient_check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
